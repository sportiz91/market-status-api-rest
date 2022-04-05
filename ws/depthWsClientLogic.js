// Requiring helpers:
const categorizer = require("../helpers/categorizer");
const averager = require("../helpers/averager");

const depthWsClientLogic = (
  decoMsg,
  operationType,
  amountToBeTraded,
  limit
) => {
  const book = decoMsg.snapshot;
  const sanatizedBook = categorizer(book, operationType);

  let averagePrice;

  // No amount to be traded means we want to query for the max book size
  // (Limit):
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

  return averagePrice;
};

module.exports = depthWsClientLogic;
