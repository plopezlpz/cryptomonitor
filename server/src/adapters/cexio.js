const axios = require("axios");
const _ = require("lodash");
const WebSocket = require("ws");
const cexioVars = require("../variables").exchanges.cexio;
const { pairs } = require("../variables");

const cexioWS = new WebSocket(cexioVars.wsUrl);


function toPath(symbolPairs) {
  let res = "";
  Object.keys(symbolPairs).forEach((p, index) => {
    if (index !== 0) {
      res += "/";
    }
    const arr = p.split("-");
    res += `${arr[0]}/${arr[1]}`;
  });
  return res;
}

/**
 * Map from:
 * <pre>
 *   [
 *    {
 *     "symbol1": "ETH",
 *     "symbol2": "BTC",
 *     "lprice": "0.023427"
 *    }
 *   ]
 * </pre>
 *
 * To
 * <pre>
 *   {
 *    "ETH-BTC": "0.023427"
 *   }
 * </pre>
 *
 * @param cexioTickers
 * @returns {{}}
 */
function mapToTickers(cexioTickers) {
  const filtered = cexioTickers.filter((t) => Object.prototype.hasOwnProperty.call(pairs, `${t.symbol1}-${t.symbol2}`));
  const res = {};
  filtered.forEach((t) => {
    res[`${t.symbol1}-${t.symbol2}`] = t.price || t.lprice;
  });
  return res;
}

function filterAndMapToTicker(t) {
  const res = {};
  if (Object.prototype.hasOwnProperty.call(pairs, `${t.symbol1}-${t.symbol2}`)) {
    res[`${t.symbol1}-${t.symbol2}`] = t.price || t.lprice;
  }
  return res;
}

/**
 * Gets the supported tickers from Cexio
 * @returns {Promise<{}>}
 */
async function getCexioTickers() {
  const res = await axios.get(`${cexioVars.apiUrl}/last_prices/${toPath(pairs)}`);
  if (res.status === 200) {
    return mapToTickers(res.data.data);
  }
  return {};
}

function onCexioTicker(cb) {
  cexioWS.on("message", (data) => {
    const json = JSON.parse(data);
    if (json.e === "tick" && !_.isEmpty(json.data)) {
      const t = filterAndMapToTicker(json.data);
      if (!_.isEmpty(t)) {
        cb(t);
      }
    }
  });

  cexioWS.once("open", () => {
    cexioWS.send(`{
      "e": "subscribe",
      "rooms": [
        "tickers"
      ]
    }`, {}, (res) => {
      if (res) {
        // Error happened
        console.error(res);
      }
    });
  });
}

module.exports = { getCexioTickers, onCexioTicker };
