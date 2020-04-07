const { createServer } = require("http");
const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");
const { serverVars } = require("./variables");
const TickersController = require("./controllers/tickers");
const HealthCheckController = require("./controllers/tickers");
const { onTicker } = require("./adapters");

const app = express();

app.use(cors({ origin: "*" }));

app.use("/health", HealthCheckController);
app.use("/tickers", TickersController);

const server = createServer(app);
server.listen(serverVars.port, () => {
  console.log(`server listening on port ${serverVars.port}`);
});

// WS
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log("Connected client through ws");
  ws.send("Connected to WS tickers!");
});

onTicker((data) => {
  wss.clients.forEach((c) => {
    c.send(JSON.stringify(data));
  });
});
