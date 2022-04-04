const express = require("express");
const WebSocket = require("ws");
const streamPrice = require("../helpers/streamPrice");
const reducer = require("../helpers/reducer");
const mapSorting = require("../helpers/mapSorting");
const finder = require("../helpers/finder");

const router = express.Router();

// @route    POST api/tip
// @desc     Fetch tip data (price & quantity) from Bitfinex API for the selected tPAIR.
// @access   Public
router.post("/", async (req, res) => {
  const pair = req.body.pairTip;

  console.log(pair);

  const webSocket = new WebSocket("ws://localhost:5000");

  webSocket.onopen = () => {
    console.log("Web Socket Code on tip.js");

    // webSocket.send("Hello from Client!");
    webSocket.send(pair);

    webSocket.on("message", (msg) => {
      console.log(`Server says: ${msg}`);

      const recreatedBook = JSON.parse(msg);
      console.log(recreatedBook);

      // Sanatizing order book:
      const keyValueArrayBids = Object.entries(recreatedBook.bids);
      const keyValueArrayAsks = Object.entries(recreatedBook.asks);

      console.log("keyValueArrayBids:");
      console.log(keyValueArrayBids);

      console.log("keyValueArrayAsks:");
      console.log(keyValueArrayAsks);

      const bidsArray = reducer(keyValueArrayBids);
      const asksArray = reducer(keyValueArrayAsks);

      console.log("bidsArray:");
      console.log(bidsArray);

      console.log("asksArray:");
      console.log(asksArray);

      const orderedBidsArray = mapSorting(bidsArray, "bids");
      const orderedAsksArray = mapSorting(asksArray, "asks");

      console.log("orderedBidsArray:");
      console.log(orderedBidsArray);

      console.log("orderedAsksArray:");
      console.log(orderedAsksArray);

      const bestBid = orderedBidsArray[0].toString();
      const bestAsk = orderedAsksArray[0].toString();

      console.log("bestBid:");
      console.log(bestBid);

      console.log("bestAsk:");
      console.log(bestAsk);

      const foundBid = finder(bestBid, bidsArray);
      const foundAsk = finder(bestAsk, asksArray);

      console.log("foundBid:");
      console.log(foundBid);

      console.log("foundAsk:");
      console.log(foundAsk);

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

      res.json(responseAgg);
    });
  };
});

module.exports = router;
