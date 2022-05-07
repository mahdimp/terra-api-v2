const { LCDClient } = require("@terra-money/terra.js");
const terraClient = new LCDClient({
  URL: "https://bombay-lcd.terra.dev",
  chainID: "bombay-12",
});

async function getBalance(address) {
  const [balance] = await terraClient.bank.balance(address);
  const balanceData = balance.toData();
  const lunaBalance = balanceData.find(
    (balanceItem) => balanceItem.denom === "uluna"
  );
  return lunaBalance ? (lunaBalance.amount / 1000000).toFixed(2) : 0;
}

module.exports = { getBalance };
