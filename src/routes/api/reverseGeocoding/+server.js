import { tomtomURL, apiVersion, TOMTOM_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";

export async function GET({ url }) {
	const lat = url.searchParams.get("lat");
	const lng = url.searchParams.get("lng");

	if (!lat || !lng) {
		return json({ error: "lat and lng parameters are required" }, { status: 400 });
	}

	if (!TOMTOM_API_KEY) {
		return json({ error: "API key not configured" }, { status: 500 });
	}

	try {
		const res = await fetch(
			`https://${tomtomURL}/search/${apiVersion}/reverseGeocode/${lat},${lng}.json?key=${TOMTOM_API_KEY}&radius=100`,
			{ headers: { "User-Agent": "Enviroweather/1.0" } },
		);
		if (!res.ok) {
			throw new Error(`TomTom API failed with status ${res.status}`);
		}
		const data = await res.json();
		return json(data);
	} catch (error) {
		console.error("Reverse geocoding error:", error);
		return json({ error: "Reverse geocoding failed" }, { status: 500 });
	}
}
