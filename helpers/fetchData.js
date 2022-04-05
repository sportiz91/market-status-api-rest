const axios = require("axios");

const fetchData = async (
  pair,
  endpointType,
  amountToBeTraded,
  operationType
) => {
  if (endpointType === "Tip") {
    const baseUrl = "https://api-pub.bitfinex.com/v2";
    const pathParams = `book/${pair}/P0`;
    const queryParams = "len=1";

    const aggUrl = `${baseUrl}/${pathParams}?${queryParams}`;

    const queryResult = await axios.get(aggUrl);
    const arrayResult = queryResult.data;

    return arrayResult;
  }

  if (endpointType === "Depth") {
    const baseUrl = "https://api-pub.bitfinex.com/v2";
    const pathParams = "calc/trade/avg";
    const queryParams = `symbol=${pair}&amount=${
      operationType === "Buy" ? amountToBeTraded : -1 * amountToBeTraded
    }`;

    const aggUrl = `${baseUrl}/${pathParams}?${queryParams}`;

    const options = {
      url: aggUrl,
      method: "POST",
      headers: {},
      data: {},
    };

    const result = await axios(options);
    const price = result.data;

    return price;
  }
};

module.exports = fetchData;
