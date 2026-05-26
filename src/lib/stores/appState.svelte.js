import { tick } from "svelte";
import {
	DEFAULT_LOCATION,
	DEFAULT_EMISSION as DEFAULT_EMISSION,
} from "./defaultValues.svelte.js";
import { fetchResults } from "$lib/api/api.js";

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
});

export const entries = $state([]);
// --- Actions ---
export function resetFormState() {
	Object.assign(appState.formDrafts[appState.activeForm], DEFAULT_DRAFTS[appState.activeForm]);
}

// sample function that will call our API to get the shape file
export async function representResults() {
	const output = await fetchResults();
	appState.geoJSONData = output;
	// TODO: REMOVE, temp code to snap the location to the test geoJSON
	appState.location.lat = output.inputs.lat;
	appState.location.lng = output.inputs.lon;
	await tick(); // let these changes take place first, then mark map fresh
	appState.mapIsUpToDate = true;
}
