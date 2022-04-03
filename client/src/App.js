import React from "react";
import HeadingTitle from "./components/HeadingTitle";
import { FiGithub, FiTwitter } from "react-icons/fi";

import "./App.css";

const App = () => {
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
            <form action="" className="formWrapper">
              <input type="text" placeholder="Insert trading pair" />
              <button type="submit">Get price & amount</button>
            </form>

            <form action="" className="formWrapper">
              <input
                type="text"
                name=""
                id=""
                placeholder="Insert trading pair"
              />

              <select name="" id="" placeholder="Operation type">
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>

              <input
                type="text"
                name=""
                id=""
                placeholder="Amount to be traded"
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
