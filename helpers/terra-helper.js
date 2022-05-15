const {
  LCDClient,
  MnemonicKey,
  MsgSend,
} = require('@terra-money/terra.js');
const { default: axios } = require('axios');
const { exit } = require('process');

require('dotenv').config();

const { NETWORK_ADDRESS, CHAIN_ID, TERRA_API } = process.env;

const terraClient = new LCDClient({
  URL: NETWORK_ADDRESS,
  chainID: CHAIN_ID,
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
  const url = `${TERRA_API}/v1/txs?offset=0&limit=100&account=${address}`;
  const res = await axios.get(url);
  return res.data;
}

async function sendTransaction(amount, to, mnemonic, memo = '') {
  const mk = new MnemonicKey({ mnemonic });
  const wallet = terraClient.wallet(mk);
  const message = new MsgSend(wallet.key.accAddress, to, { uluna: amount * 1000000 });
  const tx = await wallet.createAndSignTx({
    msgs: [message],
    memo,
  });
  const response = await terraClient.tx.broadcast(tx);
  return response;
}

module.exports = {
  getBalance, newWallet, getTransactions, sendTransaction,
};
