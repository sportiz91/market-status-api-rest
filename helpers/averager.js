const averager = (sanatizedBook, opType, amount) => {
  // Add price * weigth column:
  let weigthAcc = 0;
  let key;

  if (opType === "Buy") {
    // averagedBook = sanatizedBook.asks.reduce((acc, item) => {
    //   let priceWeighted;
    //   const weigth = item[2] / amount;
    //   weigthAcc += weigth;

    //   if (weigthAcc >= 1) {
    //     priceWeighted = 0;
    //   } else {
    //     priceWeighted = item[0] * weigth;
    //   }

    //   acc.push([item[0], item[1], item[2], item[3], priceWeighted]);
    //   return acc;
    // }, []);

    key = "asks";
  }

  if (opType === "Sell") {
    // averagedBook = sanatizedBook.bids.reduce((acc, item, index) => {
    //   let priceWeighted;
    //   const weigth = (item[2] * item[1]) / amount;

    //   if (index === 0 && weigthAcc >= 1) {
    //     acc.push([item[0], item[1], item[2], item[3], item[0]]);
    //     return acc;
    //   }

    //   if (weigthAcc >= 1) {
    //     priceWeighted = 0;
    //   } else {
    //     priceWeighted = item[0] * weigth;
    //   }

    //   acc.push([item[0], item[1], item[2], item[3], priceWeighted]);
    //   weigthAcc += weigth;
    //   return acc;
    // }, []);
    key = "bids";
  }

  const averagedBook = sanatizedBook[key].reduce((acc, item, index) => {
    let priceWeighted;
    const weigth = (item[2] * item[1]) / amount;
    const simulatedAccWeight = weigthAcc + weigth;

    if (index === 0 && simulatedAccWeight >= 1) {
      acc.push([item[0], item[1], item[2], item[3], item[0]]);
      weigthAcc = simulatedAccWeight;
      return acc;
    }

    if (weigthAcc >= 1) {
      acc.push([item[0], item[1], item[2], item[3], 0]);
      weigthAcc = simulatedAccWeight;
      return acc;
    }

    if (weigthAcc < 1 && simulatedAccWeight >= 1) {
      priceWeighted = item[0] * (1 - weigthAcc);
      acc.push([item[0], item[1], item[2], item[3], priceWeighted]);
      weigthAcc = simulatedAccWeight;
      return acc;
    }

    if (weigthAcc < 1 && simulatedAccWeight < 1) {
      priceWeighted = item[0] * weigth;
      acc.push([item[0], item[1], item[2], item[3], priceWeighted]);
      weigthAcc = simulatedAccWeight;
      return acc;
    }
  }, []);

  console.log("averagedBook:");
  console.log(averagedBook);

  const averagePrice = averagedBook.reduce((acc, item) => acc + item[4], 0);

  return averagePrice;
};

module.exports = averager;
