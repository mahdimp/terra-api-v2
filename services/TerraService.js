const { LCDClient, MnemonicKey } = require('@terra-money/terra.js');
const { default: axios } = require('axios');

const terraClient = new LCDClient({
  URL: 'https://bombay-lcd.terra.dev',
  chainID: 'bombay-12',
});

async function getBalance(address) {
  const [balance] = await terraClient.bank.balance(address);
  const balanceData = balance.toData();
  const lunaBalance = balanceData.find(
    (balanceItem) => balanceItem.denom === 'uluna',
  );
  return lunaBalance ? (lunaBalance.amount / 1000000).toFixed(2) : 0;
}

function newWallet() {
  const mk = new MnemonicKey();
  terraClient.wallet(mk);
  return mk;
}

async function getTransactions(address) {
  const url = `https://bombay-fcd.terra.dev/v1/txs?offset=0&limit=100&account=${address}`;
  const res = await axios.get(url)
  return res.data
}

module.exports = { getBalance, newWallet, getTransactions };
