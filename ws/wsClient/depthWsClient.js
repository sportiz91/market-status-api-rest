// Requiring helpers:
const reducer = require("../../helpers/reducer");
const mapSorting = require("../../helpers/mapSorting");
const finder = require("../../helpers/finder");

const depthWsClient = (theBook, theBookType, theAmount) => {
  const recreatedBook = theBook;
  const recreatedBookType = theBookType;
  const recreatedAmount = theAmount;

  console.log("recreatedBook:");
  console.log(recreatedBook);

  console.log("recreatedBookType:");
  console.log(recreatedBookType);

  // Sanatizing order book:
  const keyValueArrayBook = Object.entries(recreatedBook[theBookType]);

  console.log("keyValueArrayBook:");
  console.log(keyValueArrayBook);

  const bookArray = reducer(keyValueArrayBook);

  console.log("bookArray:");
  console.log(bookArray);

  const orderedBookArray = mapSorting(bookArray, recreatedBookType, "reduce");

  console.log("orderedBookArray:");
  console.log(orderedBookArray);

  // Hasta acá tengo el libro ordenado.

  //   const bestBid = orderedBidsArray[0].toString();
  //   const bestAsk = orderedAsksArray[0].toString();

  //   console.log("bestBid:");
  //   console.log(bestBid);

  //   console.log("bestAsk:");
  //   console.log(bestAsk);

  //   const foundBid = finder(bestBid, bidsArray);
  //   const foundAsk = finder(bestAsk, asksArray);

  //   console.log("foundBid:");
  //   console.log(foundBid);

  //   console.log("foundAsk:");
  //   console.log(foundAsk);

  return ["foundBid", "foundAsk"];
};

module.exports = depthWsClient;
