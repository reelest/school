import ShareDB from 'sharedb';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import {WebSocketPair} from "@cloudflare/workers-types";
import { Request, Response } from "@cloudflare/workers-types";


var backend = new ShareDB()

export default async function stream(request: Request) {
  const upgradeHeader = request.headers.get("Upgrade");
  if (!upgradeHeader || upgradeHeader !== "websocket") {
    return new Response("Expected Upgrade: websocket", { status: 426 });
  }

  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();

   const  stream = new WebSocketJSONStream(server);
   backend.listen(stream)
  server.addEventListener("message", (event) => {
    console.log(event.data);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}


