const depthWsClientLogic = () => {
  const webSocket = new WebSocket("ws://localhost:5000");

  webSocket.onopen = () => {
    console.log("Web Socket Code on tip.js");

    webSocket.on("message", (msg) => {
      console.log(`Server says: ${msg}`);

      const decoMsg = JSON.parse(msg);
      const book = decoMsg.snapshot;

      console.log("book:");
      console.log(book);

      const sanatizedBook = categorizer(book, operationType);

      console.log("sanatizedBook:");
      console.log(sanatizedBook);

      console.log("amountToBeTraded:");
      console.log(amountToBeTraded);

      let averagePrice;

      console.log("limit:");
      console.log(limit);

      if (!amountToBeTraded) {
        averagePrice = averager(sanatizedBook, "limit", operationType, limit);
      } else {
        averagePrice = averager(
          sanatizedBook,
          "avg",
          operationType,
          amountToBeTraded
        );
      }

      // console.log("averagePrice:");
      // console.log(averagePrice);

      // Answering frontend:
      res.json(averagePrice);

      webSocket.close();
    });

    const data = {
      crypto: pair,
      api: "depth",
    };

    // webSocket.send("Hello from Client!");
    webSocket.send(JSON.stringify(data));
  };

  webSocket.onclose = () => {
    console.log("Web Socket Client Closing!");
  };
};

module.exports = depthWsClientLogic;
