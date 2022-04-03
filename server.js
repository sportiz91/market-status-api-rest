const express = require("express");

// Router imports:
const tipRouter = require("./api/tip");
const depthRouter = require("./api/depth");

// Instantiating express app:
const app = express();

app.use(express.json({ extended: false }));

// Binding routes to routers:
app.use("/api/tip", tipRouter);
app.use("/api/depth", depthRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server up and running on server ${port}`);
});
