// Requiring ws:
const Ws = require("ws");

const finexWsServer = (crypto, client, leng) => {
  // Establishing Web Socket Connection:
  const wsUrl = "wss://api-pub.bitfinex.com/ws/2";
  const wss = new Ws(wsUrl);

  // Instantiating order book:
  const book = {};

  // On open ws connection:
  wss.on("open", () => {
    console.log("ws open");

    // Generating initial values for the book:
    book.messageCount = 0;

    // Subscribing to the pair channel defined by the user:
    wss.send(
      JSON.stringify({
        event: "subscribe",
        channel: "book",
        pair: crypto,
        prec: "P0",
        len: leng,
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

    // When book is empty:
    if (book.messageCount === 0) {
      const snapshot = data[1];
      book.snapshot = snapshot;

      book.messageCount += 1;

      client.send(JSON.stringify(book));
    }
  });
};

module.exports = finexWsServer;
