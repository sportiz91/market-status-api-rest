// Requiring setup server related:
const Ws = require("ws");

// Requiring ws logic:
const finexWsServer = require("../ws/finexWsServer");

const createWsServer = (server) => {
  const webSocketServer = new Ws.Server({ server });

  webSocketServer.on("connection", (webSocketClient) => {
    console.log("Web Socket Code on Server.js");
    // webSocketClient.send("Welcome to the server");

    webSocketClient.on("message", (msg) => {
      console.log(`Client says: ${msg}`);

      const decodedMsg = JSON.parse(msg);

      const pair = decodedMsg.crypto;
      const endpoint = decodedMsg.api;

      // ws server logic for the tip endpoint:
      if (endpoint === "tip") {
        finexWsServer(pair, webSocketClient, 1);
      }

      // ws server logic for the depth endpoint:
      if (endpoint === "depth") {
        finexWsServer(pair, webSocketClient, 250);
      }
    });
  });
};

module.exports = createWsServer;
