import {
	DEFAULT_LOCATION,
	DEFAULT_EMISSION as DEFAULT_EMISSION,
	LATLNG_PRECISION,
	DEFAULT_LAT,
	DEFAULT_LNG,
} from "./defaultValues.svelte.js";

// --- State ---
export const appState = $state({
	location: { ...DEFAULT_LOCATION },
	emission: { ...DEFAULT_EMISSION },
	geoJSONData: {},
	activeForm: "animal",
	mapIsUpToDate: false,
});

export const entries = $state([]);
// --- Actions ---
export function resetFormState() {
	Object.assign(appState.emission, DEFAULT_EMISSION);
}

// sample function that will call our API to get the shape file
export async function representResults() {
	let output = await fetchData();
	// TODO: Temp code to snap the location to the test geoJSON
	appState.location.lat = output.inputs.lat
	appState.location.lng = DEFAULT_LNG
	appState.mapIsUpToDate = true;

	// if (verifyState(output.inputs.lat, output.inputs.lon, output.inputs.oef)) {
	// 	appState.mapIsUpToDate = true;
	// } else {
	// 	console.error("Failed to match API data to local setup, try again");
	// }
}

async function fetchData(url = "example_fod_output.json") {
	// TODO: call API here, check that our current state (lat, lng, oef) matches result
	const res = await fetch(url);
	if (!res.ok)
		throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
	const data = await res.json();

	appState.geoJSONData = data;
	return data;
}

/*
 * Verifies that the local state and server geojson match
 */
function verifyState(lat, lng, oef) {
	let precision = LATLNG_PRECISION;
	return (
		appState.location.lat.toFixed(precision) === lat.toFixed(precision) &&
		appState.location.lng.toFixed(precision) === lng.toFixed(precision) &&
		appState.emission.totalEmission === oef
	);
}
