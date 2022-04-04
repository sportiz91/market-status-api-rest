// Requiring setup server related:
const express = require("express");
const http = require("http");
const Ws = require("ws");

// Requiring ws logic:
const tipWsServer = require("./ws/wsServer/tipWsServer");
const depthWsServer = require("./ws/wsServer/depthWsServer");

// Router imports:
const tipRouter = require("./api/tip");
const depthRouter = require("./api/depth");

// Instantiating express app:
const app = express();
const server = http.createServer(app);
const webSocketServer = new Ws.Server({ server });

webSocketServer.on("connection", (webSocketClient) => {
  console.log("Web Socket Code on Server.js");
  // webSocketClient.send("Welcome to the server");

  webSocketClient.on("message", (msg) => {
    console.log(`Client says: ${msg}`);

    const decodedMsg = JSON.parse(msg);

    const pair = decodedMsg.crypto;
    const endpoint = decodedMsg.api;
    let amount;
    let type;

    if (decodedMsg.tradeAmount) {
      amount = decodedMsg.tradeAmount;
    }

    if (decodedMsg.buyOrSell) {
      type = decodedMsg.buyOrSell;
    }

    if (endpoint === "tip") {
      // ws server logic for the tip endpoint:
      tipWsServer(pair, webSocketClient);
    }

    // ws server logic for the depth endpoint:
    if (endpoint === "depth") {
      depthWsServer(pair, webSocketClient, amount, type);
    }
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
