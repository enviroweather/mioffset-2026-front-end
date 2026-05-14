import { DEFAULT_LOCATION, DEFAULT_ODOR } from "./defaultValues.svelte.js";

// --- State ---
export const appState = $state({
  location: { ...DEFAULT_LOCATION },
  odor: { ...DEFAULT_ODOR },
});

export const entries = $state([]);

// --- Actions ---
export function resetAppState() {
  Object.assign(appState.odor, DEFAULT_ODOR);
}
