// --- Imports ---
import { awsURL } from "$env/static/private";
import { json } from "@sveltejs/kit";

const MAX_RETRIES = 4;
const RETRY_DELAY = 1000;

// --- GET Handler ---
export async function GET({ url }) {
	const lat = url.searchParams.get("lat");
	const lon = url.searchParams.get("lon");
	const odor_index = url.searchParams.get("odor_index");

	if (!lat || !lon || !odor_index) {
		return json({ error: "Missing required parameters" }, { status: 400 });
	}

	// Validate they're numbers in sensible ranges
	if (
		isNaN(lat) ||
		isNaN(lon) ||
		isNaN(odor_index) ||
		lat < -90 ||
		lat > 90 ||
		lon < -180 ||
		lon > 180 ||
		odor_index < 0
	) {
		return json({ error: "Invalid parameters" }, { status: 400 });
	}

	if (!awsURL) {
		return json({ error: "AWS URL not configured" }, { status: 500 });
	}

	const params = new URLSearchParams({ lat, lon, odor_index });
	try {
		for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
			const res = await fetch(`${awsURL}?${params}`, {
				headers: { "User-Agent": "Enviroweather/1.0" },
			});
			console.log(res)
			if (res.ok) {
				const data = await res.json();
				return json(data);
			}

			// Server is in a cold start so try again
			if (res.status === 503 && attempt < MAX_RETRIES) {
				await new Promise((resolve) => {
					setTimeout(resolve, RETRY_DELAY * (attempt + 1));
					console.log("Attempt at server call failed in a 503 error, trying again");
				});
				continue;
			}

			throw new Error(
				`AWS API failed with status ${res.status}: ${res.message}`,
			);
		}
	} catch (error) {
		console.error("AWS Error:", error);
		return json({ error: "AWS request failed" }, { status: 500 });
	}
}
