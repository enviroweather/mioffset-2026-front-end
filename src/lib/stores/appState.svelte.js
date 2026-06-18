import { tick } from "svelte";
import { DEFAULT_LOCATION, DEFAULT_EMISSION } from "./defaultValues.svelte.js";
import { fetchResults } from "$lib/api/fetchGeoJSON.js";

const DEFAULT_DRAFTS = {
	animal: { ...DEFAULT_EMISSION },
	storage: { ...DEFAULT_EMISSION },
	manual: { manualEmission: null },
};

// --- State ---
export const appState = $state({
	location: { ...DEFAULT_LOCATION },
	formDrafts: {
		animal: { ...DEFAULT_EMISSION },
		storage: { ...DEFAULT_EMISSION },
		manual: { manualEmission: null },
	},
	geoJSONData: {},
	activeForm: "animal",
	mapIsUpToDate: false,
	mapLoading: false,
});

export const entries = $state([]);

// --- Actions ---
export function resetFormState() {
	Object.assign(
		appState.formDrafts[appState.activeForm],
		DEFAULT_DRAFTS[appState.activeForm],
	);
}

export async function representResults() {
	if (appState.mapIsUpToDate) {
		return;
	}
	appState.mapLoading = true;
	try {
		const lat = appState.location.lat;
		const lng = appState.location.lng;
		const totalEmission = entries.reduce((sum, e) => sum + (e.totalEmission ?? 0), 0);

		const output = await fetchResults(lat, lng, totalEmission);
		console.log(output);
		appState.geoJSONData = output;
		// tick() lets geoJSONData propagate through Svelte's reactivity before
		// mapIsUpToDate = true fires the MapView effect that calls showGeoJSONLayer().
		// Without it the layer renderer reads stale/empty GeoJSON.
		await tick();
		appState.mapIsUpToDate = true;
	} finally {
		appState.mapLoading = false;
	}
}

export async function loadFromEntriesPermalink(permalinkEntries, location) {
	const permalinkTotal = permalinkEntries.reduce((sum, e) => sum + (e.totalEmission ?? 0), 0);
	const currentTotal = entries.reduce((sum, e) => sum + (e.totalEmission ?? 0), 0);

	if (currentTotal !== permalinkTotal) {
		entries.splice(0, entries.length);
		for (const entry of permalinkEntries) {
			entries.push(entry);
		}
	}

	appState.location.lat = location.lat;
	appState.location.lng = location.lng;

	const totalEmission = entries.reduce((sum, e) => sum + (e.totalEmission ?? 0), 0);

	if (totalEmission > 0) {
		appState.mapLoading = true;
		try {
			const output = await fetchResults(location.lat, location.lng, totalEmission);
			appState.geoJSONData = output;
			await tick();
			appState.mapIsUpToDate = true;
		} finally {
			appState.mapLoading = false;
		}
	}
}

