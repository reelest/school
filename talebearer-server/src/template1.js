export const ABLY_API_KEY = "YOUR_API_KEY"

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    try {
        const body = await request.text();   // Get the body from the response
        const data = JSON.parse(body);       // Parse body to JavaScript object

        if (!data) {
            return jsonResponse(null, 'Request Body cannot be empty!');
        }

        /* Ably specific code here in the sample */

        return new Response ({ text: "I'm ok!" });

    } catch (error) {
        return new Response(error, { status: 500 });
    }
}
