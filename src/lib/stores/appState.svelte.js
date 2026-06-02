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
		const totalEmission = entries.reduce((sum, e) => {
			const data = e.type === "storage" ? e.storage : e.animal;
			return sum + (data?.totalEmission ?? 0);
		}, 0);

		const output = await fetchResults(lat, lng, totalEmission);
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

export async function loadFromPermalink(lat, lng, odorIndex) {
	// entries is module-level state that survives component re-mounts (HMR, soft SvelteKit
	// navigation). Without this guard, reloading a permalink URL would push a second entry
	// on top of the first and double the total.
	const currentTotal = entries.reduce((sum, e) => {
		const data = e.type === "storage" ? e.storage : e.animal;
		return sum + (data?.totalEmission ?? 0);
	}, 0);

	if (currentTotal !== odorIndex) {
		// Entries don't match the URL - reset and add a single manual entry for the permalink value.
		entries.splice(0, entries.length);
		entries.push({
			animal: { totalEmission: odorIndex },
			location: { lat, lng, address: "" },
			snapshot: {
				location: { ...appState.location },
				formDraft: { manualEmission: odorIndex },
				activeForm: "manual",
			},
		});
	}
	// If totals match, existing entries already represent this odorIndex - leave them alone.
	appState.mapLoading = true;
	try {
		const output = await fetchResults(lat, lng, odorIndex);
		appState.geoJSONData = output;
		await tick();
		appState.mapIsUpToDate = true;
	} finally {
		appState.mapLoading = false;
	}
}
