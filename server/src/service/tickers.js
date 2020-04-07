const { getTickersFromExchanges } = require("../adapters");

async function getTickers() {
  return getTickersFromExchanges();
}

module.exports = {
  getTickers,
};
