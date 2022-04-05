// Requiring server related:
const express = require("express");
const WebSocket = require("ws");

// Requiring external packages:
const axios = require("axios");

// Instantiating server router:
const router = express.Router();

// @route    POST api/tip
// @desc     Fetch tip data (price & quantity) from Bitfinex API for the selected tPAIR.
// @access   Public
router.post("/", async (req, res) => {
  const pair = req.body.pairTip;
  const flag = req.body.realTip;

  if (flag === "One") {
    const baseUrl = "https://api-pub.bitfinex.com/v2";
    const pathParams = `book/${pair}/P0`;
    const queryParams = "len=1";

    const aggUrl = `${baseUrl}/${pathParams}?${queryParams}`;

    const queryResult = await axios.get(aggUrl);
    const arrayResult = queryResult.data;

    console.log("arrayResult:");
    console.log(arrayResult);

    const responseBid = {
      price: arrayResult[0][0],
      amount: arrayResult[0][2],
    };

    const responseAsk = {
      price: arrayResult[1][0],
      amount: Math.abs(arrayResult[1][2]),
    };

    const responseAgg = {
      bestBid: responseBid,
      bestAsk: responseAsk,
    };

    res.json(responseAgg);
  }

  if (flag === "Real") {
    const webSocket = new WebSocket("ws://localhost:5000");

    webSocket.onopen = () => {
      console.log("Web Socket Code on tip.js");

      const data = {
        crypto: pair,
        api: "tip",
      };

      // webSocket.send("Hello from Client!");
      webSocket.send(JSON.stringify(data));

      webSocket.on("message", (msg) => {
        console.log(`Server says: ${msg}`);
        const decoMsg = JSON.parse(msg);

        console.log("decoMsg:");
        console.log(decoMsg);

        // Building response object:
        const responseBid = {
          price: decoMsg.snapshot[0][0],
          amount: decoMsg.snapshot[0][2],
        };

        const responseAsk = {
          price: decoMsg.snapshot[1][0],
          amount: Math.abs(decoMsg.snapshot[1][2]),
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
