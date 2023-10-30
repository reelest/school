
export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
}

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
