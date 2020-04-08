const { getCexioTickers, onCexioTicker } = require("./cexio");
const { getBitfinexTickers, onBitfinexTicker } = require("./bitfinex");

async function getTickersFromExchanges() {
  const tickers = await Promise.all([
    getCexioTickers(),
    getBitfinexTickers(),
    // Add exchanges here
  ]);

  return {
    cexio: tickers[0],
    bitfinex: tickers[1],
  };
}

async function onTicker(cb) {
  onCexioTicker((data) => {
    // console.log("cexio: ", data);
    cb({
      cexio: data,
    });
  });

  onBitfinexTicker((data) => {
    // console.log("bitfinex: ", data);
    cb({
      bitfinex: data,
    });
  });
  // Add exchanges here
}


module.exports = {
  getTickersFromExchanges, onTicker,
};
