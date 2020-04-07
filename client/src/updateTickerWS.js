import { wsUrl } from "./variables";

export const onTickerUpdated = cb => {
  const socketConnection = new WebSocket(wsUrl);

  socketConnection.onopen = () => {
    socketConnection.send("client connected");
  };
  socketConnection.onerror = error => {
    console.log(`WebSocket error: ${error}`);
  };
  socketConnection.onmessage = e => {
    try {
      const json = JSON.parse(e.data);
      cb(json);
    } catch (e) {
      // do nothing
    }
  };
};
