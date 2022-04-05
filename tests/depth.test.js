const express = require("express");
const WebSocket = require("ws");
const startWsServer = require("../helpers/startWsServer");

jest.mock("../ws/finexWsServer.js");
const mockedFinex = require("../ws/finexWsServer");

mockedFinex.mockImplementation(() =>
  JSON.stringify({
    messageCount: 1,
    snapshot: [
      [45901, 2, 0.011],
      [45904, 1, -0.054477],
    ],
  })
);

// const sendingData = {
//   crypto: "tETHUSD",
//   api: "depth",
// };

// console.log(mockedFinex());

describe("Interaction between ws server and ws client", () => {
  const expressApp = express();
  const port = 1313;
  let server;

  beforeAll(async () => {
    server = await startWsServer(expressApp, port);
  });

  afterAll(() => server.close());

  test("Ws server initialized correctly on defined port", () => {
    expect(server).toBeTruthy();
  });

  test("Ws client initialized correctly on defined port", () => {
    const client = new WebSocket(`ws://localhost:${port}`);
    expect(client).toBeTruthy();
  });

  test("Client send msg and receives data to process", async () => {
    const client = new WebSocket(`ws://localhost:${port}`);

    client.onopen = () => {
      client.on("message", (data) => {
        responseMessage = data;
        client.close();
      });

      // Send client message
      client.send(
        JSON.stringify({
          crypto: "tBTCUSD",
          api: "depth",
        })
      );
    };
  });
});
