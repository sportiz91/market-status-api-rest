// Requiring ws:
const Ws = require("ws");

const depthWsServer = (crypto, client, tradeAmount, opType) => {
  // Establishing Web Socket Connection:
  const wsUrl = "wss://api-pub.bitfinex.com/ws/2";
  const wss = new Ws(wsUrl);

  // Instantiating order book:
  const book = {};

  // Instantiating cumulativeQt:
  //   book.cumulativeQt = 0;

  // Instantiating book type:
  //   let bookType;

  // On open ws connection:
  wss.on("open", () => {
    console.log("ws open");

    // Generating asks or bids depending on the opType:
    // if (opType === "Buy") {
    //   book.asks = {};
    //   bookType = "asks";
    // }

    // if (opType === "Sell") {
    //   book.bids = {};
    //   bookType = "bids";
    // }

    // Generating book message count:
    book.messageCount = 0;

    // Subscribing to the pair channel defined by the user:
    wss.send(
      JSON.stringify({
        event: "subscribe",
        channel: "book",
        pair: crypto,
        prec: "P0",
        len: 25,
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

    // Initialize priceToAdd object:
    // let priceToAdd;

    // Get the book snapshot:
    if (book.messageCount === 0) {
      const snapshot = data[1];
      book.snapshot = snapshot;

      console.log("book:");
      console.log(book);

      client.send(JSON.stringify(book));
    }

    // const priceData = data[1][0];
    // const countData = data[1][1];
    // const amountData = data[1][2];
    // const side = amountData >= 0 ? "bids" : "asks";

    // if (side !== bookType) return;

    // if (!countData) {
    //   delete book[side][priceData];
    //   return;
    // }

    // const absAmountData = Math.abs(amountData);

    // if (Number.isNaN(absAmountData)) {
    //   console.log("priceData:");
    //   console.log(priceData);

    //   console.log("countData:");
    //   console.log(countData);

    //   console.log("amountData:");
    //   console.log(amountData);

    //   const arrayData = priceData;

    //   console.log("arrayData:");
    //   console.log(arrayData);

    //   const decodedPrice = arrayData[0];

    //   console.log("decodedPrice:");
    //   console.log(decodedPrice);

    //   const decodedCount = arrayData[1];
    //   const decodedAmount = arrayData[2];

    //   book.messageCount += 1;
    //   book.cumulativeQt += decodedAmount;

    //   priceToAdd = {
    //     price: decodedPrice.toString(),
    //     count: decodedCount,
    //     amount: decodedAmount,
    //     cumulativeAmount: book.cumulativeQt,
    //     msgCount: book.messageCount,
    //   };
    // } else {
    //   book.messageCount += 1;
    //   book.cumulativeQt += absAmountData;

    //   priceToAdd = {
    //     price: priceData,
    //     count: countData,
    //     amount: absAmountData,
    //     cumulativeAmount: book.cumulativeQt,
    //     msgCount: book.messageCount,
    //   };
    // }

    // book[side][priceToAdd.price] = priceToAdd;

    // if (book.cumulativeQt >= tradeAmount) {
    //   const dataToSend = {
    //     book,
    //     bookType,
    //     tradeAmount,
    //   };

    //   client.send(JSON.stringify(dataToSend));
    // }
  });
};

module.exports = depthWsServer;
