import React, { useState } from "react";

import HeadingTitle from "./components/HeadingTitle";
import { FiGithub, FiTwitter } from "react-icons/fi";

import axios from "axios";

import "./App.css";

const App = () => {
  const [pairTip, setPairTip] = useState("");
  const [depth, setDepth] = useState({
    pairDepth: "",
    typeDepth: "",
    amountDepth: "",
  });

  const handleChangeTip = (e) => {
    setPairTip(e.target.value);
  };

  const handleChangeDepth = (e) => {
    setDepth({ ...depth, [e.target.name]: e.target.value });
  };

  const handleSubmitTip = async (e) => {
    e.preventDefault();

    try {
      const url = "/api/tip";
      const data = { data: pairTip };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(url, data, config);

      console.log(res);
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

      console.log("Logging depth res:");
      console.log(res);
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
            <form className="formWrapper" onSubmit={handleSubmitTip}>
              <input
                type="text"
                name="pairTip"
                value={pairTip}
                placeholder="Insert trading pair"
                onChange={handleChangeTip}
              />
              <button type="submit">Get price & amount</button>
            </form>

            <form className="formWrapper" onSubmit={handleSubmitDepth}>
              <input
                type="text"
                name="pairDepth"
                value={depth.pairDepth}
                placeholder="Insert trading pair"
                onChange={handleChangeDepth}
              />

              <select
                name="typeDepth"
                value={depth.typeDepth}
                placeholder="Operation type"
                onChange={handleChangeDepth}
              >
                <option value="0">Select operation type</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>

              <input
                type="text"
                name="amountDepth"
                value={depth.amountDepth}
                placeholder="Amount to be traded"
                onChange={handleChangeDepth}
              />

              <button type="submit">Get effective price</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
