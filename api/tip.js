const express = require("express");

const router = express.Router();

// @route    POST api/tip
// @desc     Fetch tip data (price & quantity) from Bitfinex API for the selected tPAIR.
// @access   Public
router.post("/", async (req, res) => {
  const parse = req.body;

  res.json(parse);
});

module.exports = router;
