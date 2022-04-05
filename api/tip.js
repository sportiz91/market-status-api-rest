// Requiring server related:
const express = require("express");
const WebSocket = require("ws");

// Requiring helpers:
const fetchData = require("../helpers/fetchData");

// Instantiating server router:
const router = express.Router();

// @route    POST api/tip
// @desc     Fetch tip data (price & quantity) from Bitfinex API for the selected tPAIR.
// @access   Public
router.post("/", async (req, res) => {
  // Initial variables:
  const pair = req.body.pairTip;
  const flag = req.body.realTip;

  // flag === "One" means http connection:
  if (flag === "One") {
    try {
      const arrayResult = await fetchData(pair, "Tip");

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
    } catch (err) {
      console.error(err.message);
    }
  }

  // flag === "Real" means ws connection
  if (flag === "Real") {
    const port = process.env.PORT || 5000;
    const webSocket = new WebSocket(`ws://localhost:${port}`);

    const data = {
      crypto: pair,
      api: "tip",
    };

    webSocket.onopen = () => {
      webSocket.on("message", (msg) => {
        const decoMsg = JSON.parse(msg);

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

        // Closing connection after receiving first message:
        webSocket.close();
      });

      // Sending data on open connection:
      webSocket.send(JSON.stringify(data));
    };
  }
});

module.exports = router;
