const finder = (bidOrAskPrice, bidOrAskArray) => {
  const foundItem = bidOrAskArray.find((item) => bidOrAskPrice === item[0]);

  return foundItem;
};

module.exports = finder;
