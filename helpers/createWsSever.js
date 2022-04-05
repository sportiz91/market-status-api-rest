// Requiring setup server related:
const Ws = require("ws");

// Requiring Finex WS logic:
const finexWsServer = require("../ws/finexWsServer");

const createWsServer = (server) => {
  const webSocketServer = new Ws.Server({ server });

  webSocketServer.on("connection", (webSocketClient) => {
    webSocketClient.on("message", (msg) => {
      const decodedMsg = JSON.parse(msg);

      const pair = decodedMsg.crypto;
      const endpoint = decodedMsg.api;

      // Finex ws server logic for the tip endpoint:
      if (endpoint === "tip") {
        finexWsServer(pair, webSocketClient, 1);
      }

      // Finex ws server logic for the depth endpoint:
      if (endpoint === "depth") {
        finexWsServer(pair, webSocketClient, 250);
      }
    });
  });
};

module.exports = createWsServer;
