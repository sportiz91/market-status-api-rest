// Requiring ws:
const Ws = require("ws");

const finexWsServer = (crypto, client, leng) => {
  // Establishing Web Socket Connection:
  const wsUrl = "wss://api-pub.bitfinex.com/ws/2";
  const wsFinex = new Ws(wsUrl);

  // Instantiating order book:
  const book = {};

  // On open ws connection:
  wsFinex.on("open", () => {
    // Generating initial values for the book:
    book.messageCount = 0;

    // Subscribing to the pair channel defined by the user:
    wsFinex.send(
      JSON.stringify({
        event: "subscribe",
        channel: "book",
        pair: crypto,
        prec: "P0",
        len: leng,
      })
    );
  });

  // On message received by the ws server:
  wsFinex.on("message", (msgg) => {
    // Parse the data into readable js object:
    const data = JSON.parse(msgg);

    // event or hb needs to be ruled out from the book construction:
    if (data.event || data[1] === "hb") return;

    // Generating snapshot and sending it back to the ws client:
    if (book.messageCount === 0) {
      const snapshot = data[1];
      book.snapshot = snapshot;

      book.messageCount += 1;

      client.send(JSON.stringify(book));

      // Close connection after sending the snapshot book the the ws client:
      wsFinex.close();
    }
  });
};

module.exports = finexWsServer;
