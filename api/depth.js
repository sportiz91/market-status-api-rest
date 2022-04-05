// Requiring server related:
const express = require("express");
const WebSocket = require("ws");

// Requiring external packages:
const axios = require("axios");

// Requiring helpers:
const categorizer = require("../helpers/categorizer");
const averager = require("../helpers/averager");

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
    const baseUrl = "https://api-pub.bitfinex.com/v2";
    const pathParams = "calc/trade/avg";
    const queryParams = `symbol=${pair}&amount=${
      operationType === "Buy" ? amountToBeTraded : -1 * amountToBeTraded
    }`;

    // if (limit) {
    //   console.log("LIMITE PADRE");

    //   baseUrl = "https://api-pub.bitfinex.com/v2";
    //   pathParams = "calc/trade/avg";
    //   queryParams = `symbol=${pair}&rate_limit=${limit}`;
    // }

    const aggUrl = `${baseUrl}/${pathParams}?${queryParams}`;

    console.log("aggUrl:");
    console.log(aggUrl);

    const options = {
      url: aggUrl,
      method: "POST",
      headers: {},
      data: {},
    };

    const result = await axios(options);

    const price = result.data;

    console.log("price:");
    console.log(price);

    res.json(price[0]);
  }

  if (flag === "Real") {
    const webSocket = new WebSocket("ws://localhost:5000");

    webSocket.onopen = () => {
      console.log("Web Socket Code on tip.js");

      const data = {
        crypto: pair,
        api: "depth",
      };

      // webSocket.send("Hello from Client!");
      webSocket.send(JSON.stringify(data));

      webSocket.on("message", (msg) => {
        console.log(`Server says: ${msg}`);

        const decoMsg = JSON.parse(msg);
        const book = decoMsg.snapshot;

        console.log("book:");
        console.log(book);

        // Sanatize book:
        console.log("249:");
        console.log(decoMsg.snapshot[249]);
        console.log("250:");
        console.log(decoMsg.snapshot[250]);
        console.log("251:");
        console.log(decoMsg.snapshot[251]);
        console.log("499:");
        console.log(decoMsg.snapshot[499]);

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

        // Building response object:

        // Answering frontend:
        res.json(averagePrice);
      });
    };
  }
});

module.exports = router;
