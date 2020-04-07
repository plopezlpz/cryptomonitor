import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import App from "./components/App";
//import reducers from "./reducers";

//const socketMiddleware = createSocketMiddleware(io('wss://ws.kraken.com/'));

const store = createStore(applyMiddleware(thunk));
const connection = new WebSocket("ws://localhost:8088");

connection.onopen = () => {
  connection.send("hey");
};

connection.onerror = error => {
  console.log(`WebSocket error: ${error}`);
};

connection.onmessage = e => {
  console.log(e.data);
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
