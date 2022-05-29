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
  const response = await axios.get(url);
  const { data } = response;
  const { txs } = data;
  let transactions = []
  if (txs) {
    transactions = txs.filter(transaction => {
      const txBody = transaction.tx.body;
      const txValueMsgs = txBody?.messages;
      bankMessage = getBankMessage(txValueMsgs, address)
      lunaAmount = bankMessage?.amount.find(x => x.denom === 'uluna')
      return !!lunaAmount
    })
    transactions = transactions.map( transaction => {
      const txBody = transaction.tx.body;
      const txValueMsgs = txBody?.messages;
      bankMessage = getBankMessage(txValueMsgs, address)
      value = getLunaAmount(bankMessage)
      from = bankMessage?.from_address
      to = bankMessage?.to_address
      return {
        id: transaction.id,
        timestamp: transaction.timestamp,
        gas_wanted: transaction.gas_wanted,
        gas_used: transaction.gas_used,
        txhash: transaction.txhash,
        height: transaction.height,
        memo: transaction.tx.body.memo,
        value,
        from,
        to
      }
    })
  }
  return transactions
}

function getLunaAmount(bankMessage) {
  return bankMessage?.amount.find(x => x.denom === 'uluna');
}

function getBankMessage(txValueMsgs, address) {
  return txValueMsgs?.find(message => message["@type"] === '/cosmos.bank.v1beta1.MsgSend' && message.to_address === address);
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
