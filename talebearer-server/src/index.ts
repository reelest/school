<<<<<<< HEAD
import engine from "engine.io";
import { Server } from "socket.io";
import { Engine } from "engine.io";
var io = new Server();
io.at;
=======
import { parseDataBody } from 'ably'
>>>>>>> 5431de0 (feat: start)

// setting up diffsync's DataAdapter
var diffsync = require("diffsync");
var dataAdapter = new diffsync.InMemoryDataAdapter();

// setting up the diffsync server
var diffSyncServer = new diffsync.Server(dataAdapter, io);
const server = new engine.Server();

server.on("connection", (socket) => {
  socket.send("hi");
});
<F8><F11>
<F4// …
httpServer.on("upgrade", (req, socket, head) =1q> {
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
<<<<<<< HEAD
export default {
  async fetch(
    request: Request,
    env: any,
    ctx: ExecutionContext
  ): Promise<Response> {
    return io.se;
  },
=======

const key = 'YOUR_API_KEY_HERE';

async function handleRequest(request) {
    try {
        const body = await request.text();   // Get the body from the response
        const data = JSON.parse(body);       // Parse body to JavaScript object
        
        if (!data) {
            return jsonResponse(null, 'Request Body cannot be empty!');
        }

        // Unpack the stringified message we're posting from our HTML game 
        const incomingPublisedData = parseDataBody(data);

        // Call Ably REST API to publish message
        await publishToAbly(incomingPublisedData);

        // Return a response from the Cloudflare function
        // This response is discarded in this example.
        return new Response ("OK");

    } catch (error) {
        return new Response(error, { status: 500 });
    }
}


async function publishToAbly(channel, data) {
    try {
        const URL = `https://rest.ably.io/channels/${channel}/messages?key=${key}`
        
        await fetch(`${URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data })
        });

    } catch (error) {
        return error
    }
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		return handleRequest(request);
	},
>>>>>>> 5431de0 (feat: start)
};
