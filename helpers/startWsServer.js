// Requiring setup server related:
const http = require("http");

// Requiring helpers
const createWsServer = require("./createWsSever");

const startWsServer = (expressApp, port) => {
  const server = http.createServer(expressApp);
  createWsServer(server);

  return new Promise((resolve) => {
    server.listen(port, () => {
      resolve(server);
      console.log(`Server up and running on port ${port}`);
    });
  });
};

module.exports = startWsServer;
