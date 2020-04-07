const { getCexioTickers, onCexioTicker } = require("./cexio");
const { getBitfinexTickers, onBitfinexTicker } = require("./bitfinex");

async function getTickersFromExchanges() {
  const cexioTickers = await getCexioTickers();
  const bitfinexTickers = await getBitfinexTickers();
  // Add exchanges here

  return {
    cexio: cexioTickers,
    bitfinex: bitfinexTickers,
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
