
import { getStore } from "@netlify/blobs";

export default async function handler(req) {
    const store = getStore("queendom-hearts");   // ← Ito ang store name (namespace)

    // POST = magdagdag ng heart
    if (req.method === "POST") {
        try {
            const { id } = await req.json();     // id ng artwork (example: "1", "11")

            // Kunin ang current hearts object
            let hearts = await store.get("all-hearts");
            hearts = hearts ? JSON.parse(hearts) : {};

            // Increment
            hearts[id] = (hearts[id] || 0) + 1;

            // I-save ulit
            await store.set("all-hearts", JSON.stringify(hearts));

            return new Response(JSON.stringify(hearts), { 
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            return new Response("Error", { status: 500 });
        }
    }

    // GET = kunin lahat ng hearts
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
