const sorting = (array, bidOrAsk) => {
  // const mappedAsks = recreatedBook.psnap.asks
  //   .map((price) => parseFloat(price.split(",")[0]))
  //   .sort((a, b) => a - b);
  // console.log("mappedAsks:");
  // console.log(mappedAsks);
  // const mappedBids = recreatedBook.psnap.bids
  //   .map((price) => parseFloat(price.split(",")[0]))
  //   .sort((a, b) => b - a);

  const mappedArray = array.map((item) => parseFloat(item[0]));

  const sortedArray = mappedArray.sort((a, b) => {
    if (bidOrAsk === "bids") {
      return b - a;
    }

    if (bidOrAsk === "asks") {
      return a - b;
    }
  });

  return sortedArray;
};

module.exports = sorting;
