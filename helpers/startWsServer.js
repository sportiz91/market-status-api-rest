// This helper is used to handle the creation of the WS Server.
// It takes a port and an express app as input and outputs the server listening.
// WS Server implementation is done by a helper to facilitate testing.

// Requiring setup server related:
const http = require("http");

// Requiring helpers:
const createWsServer = require("./createWsSever");

const startWsServer = (expressApp, port) => {
  // Wrapping express App in a http server:
  const server = http.createServer(expressApp);

  // Wrapping http server in a ws server (initial handshake):
  createWsServer(server);

  return new Promise((resolve) => {
    server.listen(port, () => {
      resolve(server);
      console.log(`Server up and running on port ${port}`);
    });
  });
};

module.exports = startWsServer;
