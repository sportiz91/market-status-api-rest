// Requiring setup server related:
const express = require("express");

// Requiring helpers:
const startWsServer = require("./helpers/startWsServer");

// Router imports:
const tipRouter = require("./api/tip");
const depthRouter = require("./api/depth");

// Instantiating express app:
const app = express();

// Defining port to listen:
const port = process.env.PORT || 5000;

// Parsing body of incoming requests with "application/json".
app.use(express.json({ extended: false }));

// Binding routes to routers:
app.use("/api/tip", tipRouter);
app.use("/api/depth", depthRouter);

// Starting web server with express app and defined port above:
// Separating the start server logic to facilitate tests.
startWsServer(app, port);
