// Requiring server related:
const express = require("express");
const WebSocket = require("ws");

// Requiring external packages:
const axios = require("axios");

// Requiring ws client logic for the particular endpoint:
const tipWsClient = require("../ws/wsClient/tipWsClient");

// Instantiating server router:
const router = express.Router();

// @route    POST api/depth
// @desc     Fetch real price of execution from Bitfinex API for the selected tPAIR.
// @access   Public
router.post("/", (req, res) => {
  const pair = req.body.pairDepth;
  const amountToBeTraded = req.body.amountDepth;
  const operationType = req.body.typeDepth;
  const flag = req.body.realDepth;

  // console.log("pair:");
  // console.log(pair);
  // console.log("amountToBeTraded:");
  // console.log(amountToBeTraded);
  // console.log("operationType:");
  // console.log(operationType);
  // console.log("flag:");
  // console.log(flag);

  if (flag === "One") {
    res.json("One");
  }

  if (flag === "Real") {
    const webSocket = new WebSocket("ws://localhost:5000");

    webSocket.onopen = () => {
      console.log("Web Socket Code on tip.js");

      const data = {
        crypto: pair,
        tradeAmount: amountToBeTraded,
        buyOrSell: operationType,
        api: "depth",
      };

      // webSocket.send("Hello from Client!");
      webSocket.send(JSON.stringify(data));

      webSocket.on("message", (msg) => {
        console.log(`Server says: ${msg}`);

        const [foundBid, foundAsk] = tipWsClient(msg);

        // Building response object:
        const responseBid = {
          price: foundBid[1].price,
          amount: foundBid[1].amount,
        };

        const responseAsk = {
          price: foundAsk[1].price,
          amount: foundAsk[1].amount,
        };

        const responseAgg = {
          bestBid: responseBid,
          bestAsk: responseAsk,
        };

        // Answering frontend:
        res.json(responseAgg);
      });
    };
  }
});

module.exports = router;
