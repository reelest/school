import engine from "engine.io";
import { Server } from "socket.io";
import { Engine } from "engine.io";
var io = new Server();
io.at;

// setting up diffsync's DataAdapter
var diffsync = require("diffsync");
var dataAdapter = new diffsync.InMemoryDataAdapter();

// setting up the diffsync server
var diffSyncServer = new diffsync.Server(dataAdapter, io);
const server = new engine.Server();

server.on("connection", (socket) => {
  socket.send("hi");
});

// …
httpServer.on("upgrade", (req, socket, head) => {
  server.handleUpgrade(req, socket, head);
});

httpServer.on("request", (req, res) => {
  server.handleRequest(req, res);
});
async function handleRequest(request) {
  const upgradeHeader = request.headers.get("Upgrade");
  if (!upgradeHeader || upgradeHeader !== "websocket") {
    return new Response("Expected Upgrade: websocket", { status: 426 });
  }

  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();
  server.addEventListener("message", (event) => {
    console.log(event.data);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}
export default {
  async fetch(
    request: Request,
    env: any,
    ctx: ExecutionContext
  ): Promise<Response> {
    return io.se;
  },
};
