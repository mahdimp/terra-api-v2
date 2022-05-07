var express = require("express");
var router = express.Router();
const { getBalance } = require("../services/TerraService");

router.get("/wallet/balance/:address", async function (req, res, next) {
  try {
    const { address } = req.params;
    const balance = await getBalance(address);
    res.json({
      balance,
    });
  } catch (e) {
    res.json({
      error: e.message,
    });
  }
});

module.exports = router;
