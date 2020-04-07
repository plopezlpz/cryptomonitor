const server = {
  port: process.env.PORT || 8888,
};

const exchanges = {
  cexio: {
    apiUrl: process.env.CEXIO_API_URL,
    wsUrl: process.env.CEXIO_WS_URL,
  },
  bitfinex: {
    apiUrl: process.env.BITFINEX_API_URL,
    wsUrl: process.env.BITFINEX_WS_URL,
  },
};

// format: { "BTC-USD": "BTC-USD" }
const pairArr = process.env.PAIRS.split(" ");
const pairs = {};
pairArr.forEach((p) => {
  pairs[p] = p;
});

module.exports = {
  serverVars: server, exchanges, pairs,
};
