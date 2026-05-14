// --- Imports ---
import { baseURL, ext, apiVersion, TOMTOM_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";

// --- GET Handler ---
export async function GET({ url }) {
	const query = url.searchParams.get("query");

	if (!query) {
		return json({ error: "Query parameter is required" }, { status: 400 });
	}

	if (!TOMTOM_API_KEY) {
		return json({ error: "API key not configured" }, { status: 500 });
	}

	try {
		const res = await fetch(
			`https://${baseURL}/search/${apiVersion}/geocode/${encodeURIComponent(query)}.${ext}?key=${TOMTOM_API_KEY}`,
			{ headers: { "User-Agent": "Enviroweather/1.0" } },
		);
		console.log(`https://${baseURL}/search/${apiVersion}/geocode/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}`);
		if (!res.ok) {
			throw new Error(`TomTom API failed with status ${res.status}`);
		}

		const data = await res.json();
		console.log(data);
		return json(data);
	} catch (error) {
		console.error("Geocoding error:", error);
		return json({ error: "Geocoding failed" }, { status: 500 });
	}
}
