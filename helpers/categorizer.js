const categorizer = (book, opType) => {
  let sanatizedBook;

  // [0 - 249] binds range, [250 - 499] asks range:
  if (opType === "Buy") {
    // Only care about < 250 indexes.
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
  }

  if (opType === "Sell") {
    // Only care about > 249 indexes.
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
  }

  return sanatizedBook;
};

module.exports = categorizer;
