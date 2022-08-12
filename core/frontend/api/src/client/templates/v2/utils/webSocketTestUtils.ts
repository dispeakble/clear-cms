import http from "http";
import createWebSocketServer from "./createWebSocketServer";

function startServer(port: any) {
  const server = http.createServer();
  createWebSocketServer(server);
  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

function waitForSocketState(socket: any, state: any) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      if (socket.readyState === state) {
        resolve(false);
      } else {
        waitForSocketState(socket, state).then(resolve);
      }
    }, 5);
  });
}

async function createSocketClient(closeAfter: any) {
  const client = new WebSocket(`ws://localhost:9898`);
  await waitForSocketState(client, client.OPEN);
  const messages: any = [];
  client.addEventListener("message", (data) => {
    messages.push(data);
    if (messages.length === closeAfter) {
      client.close();
    }
  });
  return [client, messages];
}

export { startServer, waitForSocketState, createSocketClient };