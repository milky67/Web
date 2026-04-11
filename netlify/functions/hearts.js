import { getStore } from "@netlify/blobs";

export default async function handler(req) {
    const store = getStore("queendom-hearts");

    if (req.method === "POST") {
        try {
            const { id } = await req.json();
            if (!id) {
                return new Response("Missing id", { status: 400 });
            }

            let hearts = await store.get("hearts");
            hearts = hearts ? JSON.parse(hearts) : {};

            hearts[id] = (hearts[id] || 0) + 1;

            await store.set("hearts", JSON.stringify(hearts));

            return new Response(JSON.stringify(hearts), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            console.error(e);
            return new Response("Error", { status: 500 });
        }
    }

    // GET all hearts
    try {
        let hearts = await store.get("hearts");
        hearts = hearts ? JSON.parse(hearts) : {};
        return new Response(JSON.stringify(hearts), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response("{}", { status: 200 });
    }
}
