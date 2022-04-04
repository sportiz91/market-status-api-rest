// Requiring helpers:
const reducer = require("../../helpers/reducer");
const mapSorting = require("../../helpers/mapSorting");
const finder = require("../../helpers/finder");

const tipWsClient = (msg) => {
  const recreatedBook = JSON.parse(msg);
  console.log(recreatedBook);

  // Sanatizing order book:
  const keyValueArrayBids = Object.entries(recreatedBook.bids);
  const keyValueArrayAsks = Object.entries(recreatedBook.asks);

  console.log("keyValueArrayBids:");
  console.log(keyValueArrayBids);

  console.log("keyValueArrayAsks:");
  console.log(keyValueArrayAsks);

  const bidsArray = reducer(keyValueArrayBids);
  const asksArray = reducer(keyValueArrayAsks);

  console.log("bidsArray:");
  console.log(bidsArray);

  console.log("asksArray:");
  console.log(asksArray);

  const orderedBidsArray = mapSorting(bidsArray, "bids");
  const orderedAsksArray = mapSorting(asksArray, "asks");

  console.log("orderedBidsArray:");
  console.log(orderedBidsArray);

  console.log("orderedAsksArray:");
  console.log(orderedAsksArray);

  const bestBid = orderedBidsArray[0].toString();
  const bestAsk = orderedAsksArray[0].toString();

  console.log("bestBid:");
  console.log(bestBid);

  console.log("bestAsk:");
  console.log(bestAsk);

  const foundBid = finder(bestBid, bidsArray);
  const foundAsk = finder(bestAsk, asksArray);

  console.log("foundBid:");
  console.log(foundBid);

  console.log("foundAsk:");
  console.log(foundAsk);

  return [foundBid, foundAsk];
};

module.exports = tipWsClient;
