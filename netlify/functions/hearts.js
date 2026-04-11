import { getStore } from "@netlify/blobs";

export default async function handler(req) {
    const store = getStore("queendom-hearts");
    
    // POST = add heart
    if (req.method === "POST") {
        try {
            const { id } = await req.json();
            
            let hearts = await store.get("all-hearts");
            hearts = hearts ? JSON.parse(hearts) : {};
            
            hearts[id] = (hearts[id] || 0) + 1;
            
            await store.set("all-hearts", JSON.stringify(hearts));
            
            return new Response(JSON.stringify(hearts), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            return new Response("Error", { status: 500 });
        }
    }
    
    // GET = return all hearts
    try {
        let hearts = await store.get("all-hearts");
        hearts = hearts ? JSON.parse(hearts) : {};
        return new Response(JSON.stringify(hearts), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response("{}", { status: 200 });
    }
}
