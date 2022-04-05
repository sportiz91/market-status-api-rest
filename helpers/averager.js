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

    // Time Complexity: O(1). Why? Because max query amount of the finex API is 250!
    const averagedBook = sanatizedBook[key].reduce((acc, item, index) => {
      let priceWeighted;
      const weigth = (item[2] * item[1]) / amountOrLimit;
      const simulatedAccWeight = weigthAcc + weigth;

      // Case: first iteration, and the book amount is greater than our desired size.
      if (index === 0 && simulatedAccWeight >= 1) {
        acc.push([item[0], item[1], item[2], item[3], item[0]]);
        weigthAcc = simulatedAccWeight;
        return acc;
      }

      // Case: surpassed our desired size, no more pushing to the acc array.
      if (weigthAcc >= 1) {
        acc.push([item[0], item[1], item[2], item[3], 0]);
        weigthAcc = simulatedAccWeight;
        return acc;
      }

      // Case: on the previous round we haven't covered our desired size, but this round surpasses our amount.
      if (weigthAcc < 1 && simulatedAccWeight >= 1) {
        priceWeighted = item[0] * (1 - weigthAcc);
        acc.push([item[0], item[1], item[2], item[3], priceWeighted]);
        weigthAcc = simulatedAccWeight;
        return acc;
      }

      // Case: on the previous round we haven't covered our desired size, and this round not surpassing it either.
      if (weigthAcc < 1 && simulatedAccWeight < 1) {
        priceWeighted = item[0] * weigth;
        acc.push([item[0], item[1], item[2], item[3], priceWeighted]);
        weigthAcc = simulatedAccWeight;
        return acc;
      }
    }, []);

    // Accumulating average prices:
    result = averagedBook.reduce((acc, item) => acc + item[4], 0);
  }

  if (avgOrLimit === "limit") {
    let limitedBook;

    // O(1), order book query from finex is finite.
    if (key === "asks") {
      let qtAcc = 0;

      // Case: sell. Accumulating qts until the current price is greater than our limit amount.
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

      // Case: buy. Accumulating qts until the current price is less than our limit amount.
      limitedBook = sanatizedBook[key].reduce((acc, item) => {
        if (item[0] >= amountOrLimit) {
          qtAcc += item[2];
          acc.push([item[0], item[1], item[2], item[3], qtAcc]);
        }

        return acc;
      }, []);
    }

    // Accumulating qts:
    result = limitedBook.reduce((acc, item) => acc + item[2], 0);
  }

  return result;
};

module.exports = averager;
