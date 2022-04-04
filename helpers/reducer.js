const reducer = (bidOrAskObject) => {
  const reducedObject = bidOrAskObject.reduce((acc, item) => {
    const priceSplit = item[0].split(",");

    if (priceSplit.length > 1) {
      acc.push([
        priceSplit[0],
        {
          price: parseFloat(priceSplit[0]),
          count: parseFloat(priceSplit[1]),
          amount: parseFloat(priceSplit[2]),
        },
      ]);
    }

    if (priceSplit.length === 1) {
      acc.push([priceSplit[0], item[1]]);
    }

    return acc;
  }, []);

  return reducedObject;
};

module.exports = reducer;
