const express = require("express");
const http = require("http");
const Ws = require("ws");

// Router imports:
const tipRouter = require("./api/tip");
const depthRouter = require("./api/depth");
const streamPrice = require("./helpers/streamPrice");

// Instantiating express app:
const app = express();
const server = http.createServer(app);
const webSocketServer = new Ws.Server({ server });

webSocketServer.on("connection", (webSocketClient) => {
  console.log("Web Socket Code on Server.js");
  // webSocketClient.send("Welcome to the server");

  // Instantiating order book:
  //   const book = {};

  webSocketClient.on("message", (msg) => {
    console.log(`Client says: ${msg}`);
    console.log(msg.toString("utf8"));

    const pair = msg.toString("utf8");

    // Establishing Web Socket Connection:
    const wsUrl = "wss://api-pub.bitfinex.com/ws/2";
    const wss = new Ws(wsUrl);

    // Instantiating order book:
    const book = {};

    // Desired Structure:
    /*
      book = {
        bids: [
          ["46000", {price, count, amount}],
          ["46001", {price, count, amount}],
          ["46002", {price, count, amount}],
        ],
        asks: [
          ["46000", {price, count, amount}],
          ["46001", {price, count, amount}],
          ["46002", {price, count, amount}],
        ],
        ... 
      }

      Why do we want an "array of arrays" and not an "object of object" (which would be more efficient
      in terms of time complexity) -> that's because with the "object of object" schema, some objects
      are not correctly formatted, so we would need to iterate and split a string.
    */

    // On open ws connection:
    wss.on("open", () => {
      console.log("ws open");

      // Generating initial values for the book:
      book.bids = {};
      book.asks = {};
      // book.psnap = {};
      book.messageCount = 0;

      // Subscribing to the pair channel defined by the user:
      wss.send(
        JSON.stringify({
          event: "subscribe",
          channel: "book",
          pair: pair,
          prec: "P0",
          len: 100,
        })
      );
    });

    // On close ws connection:
    wss.on("close", () => {
      console.log("ws close!");
    });

    // On message received by the ws server:
    wss.on("message", (msgg) => {
      // Parse the data into readable js object:
      const data = JSON.parse(msgg);

      // event or hb needs to be ruled out from the book construction:
      if (data.event || data[1] === "hb") return;

      // console.log("msg:");
      // console.log(msg);

      // console.log("data:");
      // console.log(data);

      // When book is empty:
      if (book.messageCount === 0) {
        console.log("book message count 0!");
        const priceData = data[1][0];
        const countData = data[1][1];
        const amountData = data[1][2];
        const side = amountData >= 0 ? "bids" : "asks";
        const absAmountData = Math.abs(amountData);

        const priceToAdd = {
          price: priceData,
          count: countData,
          amount: absAmountData,
        };

        book[side][priceData] = priceToAdd;

        // Example: book.bids[0] -> ["46001", {price, count, amount}]
        // book[side].push([priceToAdd.price, priceToAdd]);
        book.messageCount += 1;
      } else {
        const priceToAdd = {
          price: data[1][0],
          count: data[1][1],
          amount: data[1][2],
        };

        if (!priceToAdd.count) {
          if (priceToAdd.amount > 0) {
            if (book.bids[priceToAdd.price]) {
              delete book.bids[priceToAdd.price];
            }
          } else if (priceToAdd.amount < 0) {
            if (book.asks[priceToAdd.price]) {
              delete book.asks[priceToAdd.price];
            }
          }
        } else {
          const side = priceToAdd.amount >= 0 ? "bids" : "asks";
          priceToAdd.amount = Math.abs(priceToAdd.amount);
          book[side][priceToAdd.price] = priceToAdd;
        }

        // Ordering book:
        // const bookAskPrices = Object.keys(book.asks);
        // const bookBidPrices = Object.keys(book.bids);

        // const askPrices = bookAskPrices.sort((a, b) => a - b);
        // const bidPrices = bookBidPrices.sort((a, b) => b - a);

        // book.psnap.bids = bidPrices;
        // book.psnap.asks = askPrices;
        book.messageCount += 1;
      }

      // console.log(book);
      // console.log(typeof book.messageCount);

      if (book.messageCount === 30) {
        console.log("book message count 15!");
        console.log(book);
        webSocketClient.send(JSON.stringify(book));
        // webSocketClient.send("YESSSSSS!");
      }
    });
  });
});

// Parsing body of incoming requests with "application/json".
app.use(express.json({ extended: false }));

// Binding routes to routers:
app.use("/api/tip", tipRouter);
app.use("/api/depth", depthRouter);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server up and running on server ${port}`);
});
