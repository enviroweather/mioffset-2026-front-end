import { DEFAULT_LOCATION, DEFAULT_EMISSION } from "./defaultValues.svelte.js";

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

/** @type {any[]} */
export const entries = $state([]);

// --- Actions ---
export function resetFormState() {
	const form = /** @type {Record<string, any>} */ (appState.formDrafts);
	const drafts = /** @type {Record<string, any>} */ (DEFAULT_DRAFTS);
	Object.assign(form[appState.activeForm], drafts[appState.activeForm]);
}

/**
 * Populates entries from a permalink URL without running the model.
 * Call getAndRun() from runModel.svelte.ts afterwards to compute the footprint.
 * @param {number} lat
 * @param {number} lng
 * @param {number} odorIndex
 */
export function loadFromPermalink(lat, lng, odorIndex) {
	const currentTotal = entries.reduce((sum, e) => {
		const data = e.type === "storage" ? e.storage : e.animal;
		return sum + (data?.totalEmission ?? 0);
	}, 0);

	if (currentTotal !== odorIndex) {
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
}
