// Requiring server related:
const express = require("express");
const WebSocket = require("ws");

// Requiring helpers:
const categorizer = require("../helpers/categorizer");
const averager = require("../helpers/averager");
const fetchPriceDepth = require("../helpers/fetchPriceDepth");

// Requiring client ws logic:
const depthWsClientLogic = require("../ws/depthWsClientLogic");

// Instantiating server router:
const router = express.Router();

// @route    POST api/depth
// @desc     Fetch real price of execution from Bitfinex API for the selected tPAIR.
// @access   Public
router.post("/", async (req, res) => {
  const pair = req.body.pairDepth;
  const amountToBeTraded = req.body.amountDepth;
  const limit = req.body.limitDepth;
  const operationType = req.body.typeDepth;
  const flag = req.body.realDepth;

  if (flag === "One" && limit) return;

  if (flag === "One") {
    const price = await fetchPriceDepth(pair, amountToBeTraded, operationType);
    res.json(price[0]);
  }

  if (flag === "Real") {
    const webSocket = new WebSocket("ws://localhost:5000");

    webSocket.onopen = () => {
      console.log("Web Socket Code on tip.js");

      webSocket.on("message", (msg) => {
        console.log(`Server says: ${msg}`);

        const decoMsg = JSON.parse(msg);
        const book = decoMsg.snapshot;

        console.log("book:");
        console.log(book);

        const sanatizedBook = categorizer(book, operationType);

        console.log("sanatizedBook:");
        console.log(sanatizedBook);

        console.log("amountToBeTraded:");
        console.log(amountToBeTraded);

        let averagePrice;

        console.log("limit:");
        console.log(limit);

        if (!amountToBeTraded) {
          averagePrice = averager(sanatizedBook, "limit", operationType, limit);
        } else {
          averagePrice = averager(
            sanatizedBook,
            "avg",
            operationType,
            amountToBeTraded
          );
        }

        // console.log("averagePrice:");
        // console.log(averagePrice);

        // Answering frontend:
        res.json(averagePrice);

        webSocket.close();
      });

      const data = {
        crypto: pair,
        api: "depth",
      };

      // webSocket.send("Hello from Client!");
      webSocket.send(JSON.stringify(data));
    };

    webSocket.onclose = () => {
      console.log("Web Socket Client Closing!");
    };
  }
});

module.exports = router;
