import { getStore } from "@netlify/blobs";

export default async function handler(req) {
    const store = getStore("queendom-hearts");
    
    // POST = add heart
    if (req.method === "POST") {
        try {
            const { id } = await req.json();
            
            if (!id) {
                return new Response(JSON.stringify({ error: "Missing id" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }
            
            let hearts = await store.get("all-hearts");
            hearts = hearts ? JSON.parse(hearts) : {};
            
            hearts[id] = (hearts[id] || 0) + 1;
            
            await store.set("all-hearts", JSON.stringify(hearts));
            
            return new Response(JSON.stringify(hearts), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            console.error("Heart POST error:", e);
            return new Response(JSON.stringify({ error: "Server error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }
    
    // GET = return all hearts
    if (req.method === "GET") {
        try {
            let hearts = await store.get("all-hearts");
            hearts = hearts ? JSON.parse(hearts) : {};
            return new Response(JSON.stringify(hearts), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            console.error("Heart GET error:", e);
            return new Response("{}", {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
    }
    
    // Other methods not allowed
    return new Response("Method not allowed", { status: 405 });
}
