import {
	DEFAULT_LOCATION,
	DEFAULT_EMISSION as DEFAULT_EMISSION,
} from "./defaultValues.svelte.js";

// --- State ---
export const appState = $state({
	location: { ...DEFAULT_LOCATION },
	emission: { ...DEFAULT_EMISSION },
	mapIsUpToDate: false,
});

export const entries = $state([]);

// --- Actions ---
export function resetAppState() {
	Object.assign(appState.emission, DEFAULT_EMISSION);
}

// sample function that will call our API to get the shape file
export function calculateResults() {
	appState.mapIsUpToDate = true;
}
