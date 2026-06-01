import { tick } from "svelte";
import {
	DEFAULT_LOCATION,
	DEFAULT_EMISSION as DEFAULT_EMISSION,
} from "./defaultValues.svelte.js";
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
		const totalEmission = entries.reduce((sum, e) => {
			const data = e.type === "storage" ? e.storage : e.animal;
			return sum + (data?.totalEmission ?? 0);
		}, 0);
		
		const output = await fetchResults(
			appState.location.lat,
			appState.location.lng,
			totalEmission,
		);
		appState.geoJSONData = output;
		await tick();
		appState.mapIsUpToDate = true;
	} finally {
		appState.mapLoading = false;
	}
}
