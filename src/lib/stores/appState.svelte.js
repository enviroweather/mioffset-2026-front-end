import { DEFAULT_LOCATION, DEFAULT_ODOR } from "./defaultValues.svelte.js";

// --- State ---
export const appState = $state({
  location: { ...DEFAULT_LOCATION },
  odor: { ...DEFAULT_ODOR },
  mapIsUpToDate: false,
});

export const entries = $state([]);

// Finalized locations — each holds a lat/lng, address, totalOEF, and snapshot of entries
export const savedLocations = $state([]);

// --- Actions ---
export function resetAppState() {
  Object.assign(appState.odor, DEFAULT_ODOR);
}

// sample function that will call our API to get the shape file
export function calculateResults() {
  appState.mapIsUpToDate = true;
  console.log("User is wants to calculate their odor results");
}

// function that allows for multiple sites to be both used in one app
// export function saveCurrentLocation() {
//   const totalOEF = entries.reduce((sum, e) => sum + (e.odor.totalEmission ?? 0), 0);
//   savedLocations.push({
//     lat: appState.location.lat,
//     lng: appState.location.lng,
//     address: appState.location.address,
//     totalOEF,
//     entries: entries.map((e) => ({ ...e })),
//   });
//   entries.splice(0, entries.length);
// }
