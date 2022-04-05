// Requiring server related:
const express = require("express");
const WebSocket = require("ws");

// Requiring helpers:
const fetchData = require("../helpers/fetchData");

// Requiring client ws logic:
const depthWsClientLogic = require("../ws/depthWsClientLogic");

// Instantiating server router:
const router = express.Router();

// @route    POST api/depth
// @desc     Fetch real price of execution from Bitfinex API for the selected tPAIR.
// @access   Public
router.post("/", async (req, res) => {
  // Initial variables:
  const pair = req.body.pairDepth;
  const amountToBeTraded = req.body.amountDepth;
  const limit = req.body.limitDepth;
  const operationType = req.body.typeDepth;
  const flag = req.body.realDepth;

  if (flag === "One" && limit) return;

  // flag === "One" means http connection:
  if (flag === "One") {
    try {
      const price = await fetchData(
        pair,
        "Depth",
        amountToBeTraded,
        operationType
      );
      res.json(price[0]);
    } catch (err) {
      console.error(err);
    }
  }

  // flag === "Real" means ws connection
  if (flag === "Real") {
    const port = process.env.PORT || 5000;
    const webSocket = new WebSocket(`ws://localhost:${port}`);

    const data = {
      crypto: pair,
      api: "depth",
    };

    webSocket.onopen = () => {
      webSocket.on("message", (msg) => {
        const decoMsg = JSON.parse(msg);

        // Applying ws logic for depth api:
        const averagePrice = depthWsClientLogic(
          decoMsg,
          operationType,
          amountToBeTraded,
          limit
        );

        // Answering frontend:
        res.json(averagePrice);

        // Closing connection after receiving first message:
        webSocket.close();
      });

      // Sending data on open connection:
      webSocket.send(JSON.stringify(data));
    };
  }
});

module.exports = router;
