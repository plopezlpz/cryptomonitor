const axios = require("axios");
const WebSocket = require("ws");
const _ = require("lodash");
const bitfinexVars = require("../variables").exchanges.bitfinex;
const { pairs } = require("../variables");

const bitfinexWS = new WebSocket(bitfinexVars.wsUrl);

function toPath(symbolPairs) {
  let res = "";
  Object.keys(symbolPairs).forEach((p, index) => {
    if (index !== 0) {
      res += ",";
    }
    const arr = p.split("-");
    res += `t${arr[0]}${arr[1]}`;
  });
  return res;
}
/**
 * From `tBTCUSD` to `BTC-USD`
 * @param symbol
 */
function toPair(symbol) {
  return `${symbol.substring(1, 4)}-${symbol.substring(4, 7)}`;
}

function toSymbol(pair) {
  const arr = pair.split("-");
  return `t${arr[0]}${arr[1]}`;
}

function filterAndToTicker(bitfinexTicker) {
  const p = toPair(bitfinexTicker[0]);
  if (_.has(pairs, p)) {
    const res = {};
    res[p] = bitfinexTicker[7].toString();
    return res;
  }
  return null;
}

/**
 *
 * Map from:
 * <pre>
 *  [
 *    [
 *      SYMBOL,
 *      BID,
 *      BID_SIZE,
 *      ASK,
 *      ASK_SIZE,
 *      DAILY_CHANGE,
 *      DAILY_CHANGE_RELATIVE,
 *      LAST_PRICE,
 *      VOLUME,
 *      HIGH,
 *      LOW
 *    ]
 *  ]
 * </pre>
 *
 * To
 * <pre>
 *   {
 *    "ETH-BTC": "0.023427"
 *   }
 * </pre>
 *
 * @param bitfinexTickers
 * @returns {{}}
 */
function mapToTickers(bitfinexTickers) {
  const res = {};
  bitfinexTickers.forEach((t) => {
    const converted = filterAndToTicker(t);
    if (converted) {
      _.assign(res, converted);
    }
  });
  return res;
}

async function getBitfinexTickers() {
  const res = await axios.get(`${bitfinexVars.apiUrl}/tickers?symbols=${toPath(pairs)}`);
  if (res.status === 200) {
    return mapToTickers(res.data);
  }
  return {};
}

const subToTicker = {};

function onBitfinexTicker(cb) {
  bitfinexWS.on("message", (data) => {
    const json = JSON.parse(data);
    if (json.event === "subscribed") {
      subToTicker[json.chanId] = toPair(json.symbol);
    } else if (_.has(subToTicker, json[0])) {
      if (json[1].length > 4) {
        const r = {};
        r[subToTicker[json[0]]] = json[1][0].toString();
        cb(r);
      }
    }
  });

  bitfinexWS.once("open", () => {
    Object.keys(pairs).forEach((p) => {
      bitfinexWS.send(`{
      "event": "subscribe",
      "channel": "ticker",
      "symbol": "${toSymbol(p)}"
    }`, {}, (res) => {
        if (res) {
          console.error(res);
        }
      });
    });
  });
}

module.exports = { getBitfinexTickers, onBitfinexTicker };
