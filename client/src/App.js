import React, { useState } from "react";

import HeadingTitle from "./components/HeadingTitle";
import { FiGithub, FiTwitter } from "react-icons/fi";

import axios from "axios";

import "./App.css";

const App = () => {
  const [pair, setPair] = useState({
    pairTip: "",
    realTip: "",
  });
  const [depth, setDepth] = useState({
    pairDepth: "",
    realDepth: "",
    typeDepth: "",
    amountDepth: "",
    limitDepth: "",
    amountLimitSelectDepth: "",
  });
  const [best, setBest] = useState({
    bidPrice: "",
    bidAmount: "",
    askPrice: "",
    askAmount: "",
  });
  const [avg, setAvg] = useState("");

  const handleChangeTip = (e) => {
    setPair({ ...pair, [e.target.name]: e.target.value });
  };

  const handleChangeDepth = (e) => {
    if (
      e.target.name === "amountLimitSelectDepth" &&
      e.target.value === "Amount"
    ) {
      setDepth({ ...depth, limitDepth: "", [e.target.name]: e.target.value });
    } else if (
      e.target.name === "amountLimitSelectDepth" &&
      e.target.value === "Effective"
    ) {
      setDepth({ ...depth, amountDepth: "", [e.target.name]: e.target.value });
    } else {
      setDepth({ ...depth, [e.target.name]: e.target.value });
    }
  };

  const handleSubmitTip = async (e) => {
    e.preventDefault();

    try {
      const url = "api/tip";
      const data = pair;

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(url, data, config);

      console.log(res);

      setBest({
        bidPrice: res.data.bestBid.price,
        bidAmount: res.data.bestBid.amount,
        askPrice: res.data.bestAsk.price,
        askAmount: res.data.bestAsk.amount,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitDepth = async (e) => {
    e.preventDefault();

    try {
      const url = "api/depth";
      const data = depth;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(url, data, config);

      console.log(res);

      setAvg(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="homeWrapper">
      <div className="homeLayout">
        <HeadingTitle description="Membrane Coding Challenge: Market API Rest" />

        <div className="homeInfo">
          <div className="homeInfoRow">
            <p>Coder: Santiago Pablo Ortiz</p>
            <div>
              <img src="/images/me1.jpg" alt="author" />
            </div>
          </div>

          <div className="homeInfoRow">
            <p>Reach me out</p>
            <div>
              <a
                href="https://www.github.com/sportiz91/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiGithub size={"2.1rem"} />
              </a>

              <a
                href="https://www.twitter.com/sportiz91/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiTwitter size={"2.1rem"} />
              </a>
            </div>
          </div>

          <div className="endPointWrapper">
            <div className="leftEnd">
              <h1>Tip Endpoint</h1>
              <form className="formWrapper" onSubmit={handleSubmitTip}>
                <input
                  type="text"
                  name="pairTip"
                  value={pair.pairTip}
                  placeholder="Trading pair (tBTCUSD, tETHUSD, tYYYZZZ)"
                  onChange={handleChangeTip}
                />
                <select
                  name="realTip"
                  value={pair.realTip}
                  onChange={handleChangeTip}
                >
                  <option value="" disabled selected>
                    Real vs One Time Request
                  </option>
                  <option value="Real">Real</option>
                  <option value="One">One Time Request</option>
                </select>
                <button type="submit">Get price & amount</button>
              </form>
              <p>
                Best bid price: {best.bidPrice} & amount: {best.bidAmount}
              </p>
              <p>
                Best ask price: {best.askPrice} & amount: {best.askAmount}
              </p>
            </div>

            <div className="leftEnd">
              <h1>Depth Endpoint</h1>
              <form className="formWrapper" onSubmit={handleSubmitDepth}>
                <input
                  type="text"
                  name="pairDepth"
                  value={depth.pairDepth}
                  placeholder="Trading pair (tBTCUSD, tETHUSD, tYYYZZZ)"
                  onChange={handleChangeDepth}
                  required
                />

                <select
                  name="amountLimitSelectDepth"
                  value={depth.amountLimitSelectDepth}
                  onChange={handleChangeDepth}
                  required
                >
                  <option value="" disabled selected>
                    Amount traded vs Effective price
                  </option>
                  <option value="Amount">Amount Traded</option>
                  <option value="Effective">Effective price</option>
                </select>

                {depth.amountLimitSelectDepth === "" ? (
                  ""
                ) : depth.amountLimitSelectDepth === "Amount" ? (
                  <input
                    type="text"
                    name="amountDepth"
                    value={depth.amountDepth}
                    placeholder="Amount to be traded"
                    onChange={handleChangeDepth}
                  />
                ) : (
                  <input
                    type="text"
                    name="limitDepth"
                    value={depth.limitDepth}
                    placeholder="Limit price for the execution"
                    onChange={handleChangeDepth}
                  />
                )}

                <select
                  name="typeDepth"
                  value={depth.typeDepth}
                  placeholder="Operation type"
                  onChange={handleChangeDepth}
                >
                  <option value="" disabled selected>
                    Select operation type
                  </option>
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                </select>

                <select
                  name="realDepth"
                  value={pair.realDepth}
                  onChange={handleChangeDepth}
                >
                  <option value="" disabled selected>
                    Real vs One Time Request
                  </option>
                  <option value="Real">Real</option>
                  <option value="One">One Time Request</option>
                </select>

                <button type="submit">Get effective price</button>
              </form>

              <p>
                {depth.amountDepth
                  ? depth.realDepth === "Real"
                    ? "Average price of execution"
                    : "Simple avg price"
                  : "Maximum order size"}
                : {avg}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
