const express = require("express");

const router = express.Router();

// @route    POST api/depth
// @desc     Fetch real price of execution from Bitfinex API for the selected tPAIR.
// @access   Public
router.post("/", (req, res) => {
  const parse = req.body;

  res.json(parse);
});

module.exports = router;
