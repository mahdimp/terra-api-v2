const express = require('express');

const router = express.Router();
const { getBalance, newWallet } = require('../services/TerraService');

router.get('/wallet/balance/:address', async (req, res) => {
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

router.get('/wallet/new', async (req, res) => {
  try {
    const mk = newWallet();
    const accountAddress = mk.accAddress;
    const { mnemonic } = mk;
    res.json({
      mnemonic,
      accountAddress,
    });
  } catch (e) {
    res.json({
      error: e.message,
    });
  }
});

module.exports = router;
