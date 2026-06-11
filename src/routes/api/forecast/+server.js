// --- Imports ---
import { json } from "@sveltejs/kit";
import { closestGridPoint } from "$lib/windModel/geo.js";
import { loadFromS3 } from "$lib/windModel/server/s3Client.js";
import { legacyFodModel } from "$lib/windModel/fodModel.js";

// --- GET Handler ---
export async function GET({ url }) {
	const lat = parseFloat(url.searchParams.get("lat"));
	const lon = parseFloat(url.searchParams.get("lon"));
	const odor_index = parseFloat(url.searchParams.get("odor_index"));

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
		return json({ error: "Invalid or missing parameters" }, { status: 400 });
	}

	try {
		const [gridX, gridY] = closestGridPoint(lat, lon);
		const windData = await loadFromS3(`json/narr/narr_${gridX}_${gridY}.json`);
		const result = legacyFodModel(windData.WD, windData.WS, windData.PC, odor_index);
		return json(result);
	} catch (error) {
		console.error("FOD model error:", error);
		return json({ error: "Model run failed" }, { status: 500 });
	}
}
