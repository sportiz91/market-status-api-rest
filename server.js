// Requiring setup server related:
const express = require("express");
const path = require("path");

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

// Serve static assets in production:
if (process.env.NODE_ENV === "production") {
  // Set static folder:
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Starting web server with express app and defined port:
// This is donde by a helper to facilitate testing.
startWsServer(app, port);
