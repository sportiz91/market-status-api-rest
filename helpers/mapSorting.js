// mapSorting helper is used to return an array of the prices (only):
const mapSorting = (array, bidOrAsk, type) => {
  // let sortedArray;

  const mappedArray = array.map((item) => parseFloat(item[0]));

  const sortedArray = mappedArray.sort((a, b) => {
    if (bidOrAsk === "bids") {
      return b - a;
    }

    if (bidOrAsk === "asks") {
      return a - b;
    }
  });

  // if (type === "reduce") {
  //   sortedArray = sortedArray.reduce((acc, itemReduce) => {
  //     const foundAmount = array.find(
  //       (item) => item[0] === itemReduce.toString()
  //     ).amount;

  //     acc.push()
  //   }, []);
  // }

  return sortedArray;
};

module.exports = mapSorting;
