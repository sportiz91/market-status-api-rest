const axios = require("axios");

const fetchPriceDepth = async (pair, amountToBeTraded, operationType) => {
  const baseUrl = "https://api-pub.bitfinex.com/v2";
  const pathParams = "calc/trade/avg";
  const queryParams = `symbol=${pair}&amount=${
    operationType === "Buy" ? amountToBeTraded : -1 * amountToBeTraded
  }`;

  const aggUrl = `${baseUrl}/${pathParams}?${queryParams}`;

  console.log("aggUrl:");
  console.log(aggUrl);

  const options = {
    url: aggUrl,
    method: "POST",
    headers: {},
    data: {},
  };

  const result = await axios(options);

  const price = result.data;

  console.log("price:");
  console.log(price);

  return price;
};

module.exports = fetchPriceDepth;
