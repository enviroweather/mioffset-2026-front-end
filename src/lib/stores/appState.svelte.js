import { DEFAULT_LOCATION, DEFAULT_ODOR } from "./defaultValues.svelte.js";

// --- State ---
export const appState = $state({
  location: { ...DEFAULT_LOCATION },
  odor: { ...DEFAULT_ODOR },
});

export const entries = $state([]);

// Finalized locations — each holds a lat/lng, address, totalOEF, and snapshot of entries
export const savedLocations = $state([]);

// --- Actions ---
export function resetAppState() {
  Object.assign(appState.odor, DEFAULT_ODOR);
}

export function saveCurrentLocation() {
  const totalOEF = entries.reduce((sum, e) => sum + (e.odor.totalEmission ?? 0), 0);
  savedLocations.push({
    lat: appState.location.lat,
    lng: appState.location.lng,
    address: appState.location.address,
    totalOEF,
    entries: entries.map((e) => ({ ...e })),
  });
  entries.splice(0, entries.length);
}
