const averager = (sanatizedBook, avgOrLimit, opType, amountOrLimit) => {
  let key;
  let result;

  if (opType === "Buy") {
    key = "asks";
  }

  if (opType === "Sell") {
    key = "bids";
  }

  if (avgOrLimit === "avg") {
    let weigthAcc = 0;

    const averagedBook = sanatizedBook[key].reduce((acc, item, index) => {
      let priceWeighted;
      const weigth = (item[2] * item[1]) / amountOrLimit;
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

    result = averagedBook.reduce((acc, item) => acc + item[4], 0);
  }

  if (avgOrLimit === "limit") {
    console.log(amountOrLimit);

    let limitedBook;

    if (key === "asks") {
      let qtAcc = 0;

      limitedBook = sanatizedBook[key].reduce((acc, item) => {
        if (item[0] <= amountOrLimit) {
          qtAcc += item[2];
          acc.push([item[0], item[1], item[2], item[3], qtAcc]);
        }

        return acc;
      }, []);
    }

    if (key === "bids") {
      let qtAcc = 0;

      limitedBook = sanatizedBook[key].reduce((acc, item) => {
        if (item[0] >= amountOrLimit) {
          qtAcc += item[2];
          acc.push([item[0], item[1], item[2], item[3], qtAcc]);
        }

        return acc;
      }, []);
    }

    console.log("limitedBook:");
    console.log(limitedBook);

    result = limitedBook.reduce((acc, item) => acc + item[2], 0);
  }

  return result;
};

module.exports = averager;
