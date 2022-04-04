// Requiring ws:
const Ws = require("ws");

const tipWsServer = (crypto, client, tradeAmount, opType) => {
  // Establishing Web Socket Connection:
  const wsUrl = "wss://api-pub.bitfinex.com/ws/2";
  const wss = new Ws(wsUrl);

  // Instantiating order book:
  const book = {};

  // On open ws connection:
  wss.on("open", () => {
    console.log("w s open");

    // Generating initial values for the book:
    book.bids = {};
    book.asks = {};
    book.messageCount = 0;

    // Subscribing to the pair channel defined by the user:
    wss.send(
      JSON.stringify({
        event: "subscribe",
        channel: "book",
        pair: crypto,
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

      book.messageCount += 1;
    }

    if (book.messageCount === 30) {
      client.send(JSON.stringify(book));
    }
  });
};

module.exports = tipWsServer;
