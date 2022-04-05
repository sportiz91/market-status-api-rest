const categorizer = (book, opType) => {
  let sanatizedBook;

  // [0 - 249] range bids, [250 - 499] range asks:
  if (opType === "Buy") {
    sanatizedBook = book.reduce(
      (acc, item, index) => {
        if (index < 250) return acc;

        acc.asks.push([item[0], item[1], -1 * item[2], "asks"]);
        return acc;
      },
      {
        asks: [],
      }
    );

    // console.log("sanatizedBook Length:");
    // console.log(sanatizedBook.asks.length);
  }

  if (opType === "Sell") {
    sanatizedBook = book.reduce(
      (acc, item, index) => {
        if (index > 249) return acc;

        acc.bids.push([item[0], item[1], item[2], "bids"]);
        return acc;
      },
      {
        bids: [],
      }
    );
    // console.log("sanatizedBook Length:");
    // console.log(sanatizedBook.bids.length);
  }

  return sanatizedBook;
};

module.exports = categorizer;
