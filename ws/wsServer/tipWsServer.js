// Requiring ws:
const Ws = require("ws");

const tipWsServer = (crypto, client) => {
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
    // book.bids = {};
    // book.asks = {};

    // Subscribing to the pair channel defined by the user:
    wss.send(
      JSON.stringify({
        event: "subscribe",
        channel: "book",
        pair: crypto,
        prec: "P0",
        len: 1,
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

      console.log("book:");
      console.log(book);

      client.send(JSON.stringify(book));
    }
    // } else {
    //   const priceToAdd = {
    //     price: data[1][0],
    //     count: data[1][1],
    //     amount: data[1][2],
    //   };

    //   if (!priceToAdd.count) {
    //     if (priceToAdd.amount > 0) {
    //       if (book.bids[priceToAdd.price]) {
    //         delete book.bids[priceToAdd.price];
    //       }
    //     } else if (priceToAdd.amount < 0) {
    //       if (book.asks[priceToAdd.price]) {
    //         delete book.asks[priceToAdd.price];
    //       }
    //     }
    //   } else {
    //     const side = priceToAdd.amount >= 0 ? "bids" : "asks";
    //     priceToAdd.amount = Math.abs(priceToAdd.amount);
    //     book[side][priceToAdd.price] = priceToAdd;
    //   }

    //   book.messageCount += 1;
    // }

    // if (book.messageCount === 60) {
    //   client.send(JSON.stringify(book));
    // }
  });
};

module.exports = tipWsServer;
