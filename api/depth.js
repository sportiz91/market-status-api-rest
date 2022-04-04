// Requiring server related:
const express = require("express");
const WebSocket = require("ws");

// Requiring external packages:
const axios = require("axios");

// Requiring ws client logic for the particular endpoint:
const depthWsClient = require("../ws/wsClient/depthWsClient");

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

        const decodedMsg = JSON.parse(msg);

        const theBook = decodedMsg.book;
        const theBookType = decodedMsg.bookType;
        const theAmount = decodedMsg.tradeAmount;

        const [foundBid, foundAsk] = depthWsClient(
          theBook,
          theBookType,
          theAmount
        );

        // Building response object:
        // const responseBid = {
        //   price: foundBid[1].price,
        //   amount: foundBid[1].amount,
        // };

        // const responseAsk = {
        //   price: foundAsk[1].price,
        //   amount: foundAsk[1].amount,
        // };

        // const responseAgg = {
        //   bestBid: responseBid,
        //   bestAsk: responseAsk,
        // };

        // Answering frontend:
        res.json("momentáneo");
      });
    };
  }
});

module.exports = router;
