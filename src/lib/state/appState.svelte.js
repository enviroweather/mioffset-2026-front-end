import {
	DEFAULT_LOCATION,
	DEFAULT_BUILDING,
	TYPE_SPECIFIC_FIELDS,
} from "./defaultValues.svelte.js";
import { weightedCentroid, totalOEF } from "$lib/utils/model/centroid.js";
import { DEFAULT_BASEMAP } from "$lib/utils/map/basemaps.js";

// --- State ---

/**
 * The site's buildings - livestock housing and manure storage structures, one
 * per row of the MI OFFSET 2018 Centroid Worksheet. Each carries its own
 * surveyed position; the odor source is their emission-weighted centroid.
 */
export const buildings = $state([]);

export const appState = $state({
	// Map camera only. Address search and the coordinate readout move the view;
	// they no longer define where the model runs.
	location: { ...DEFAULT_LOCATION },
	manualAddress: false,
	// id of the building currently open in the form panel, or null.
	selectedId: null,
	// true while the palette is armed and the next map click drops a building.
	placing: false,
	geoJSONData: {},
	mapIsUpToDate: false,
	mapLoading: false,
	// Shared across pages so the basemap picked on the map page carries into the report.
	basemap: DEFAULT_BASEMAP,
});

// Monotonic so deleting "Building 2" never leaves two buildings sharing a name.
let nextBuildingNumber = 1;

// --- Derived site values ---

/**
 * Getters rather than $derived exports: this module is imported by plain .js
 * as well as components, and a getter recomputes lazily at each read site while
 * still tracking `buildings` for whichever effect is reading it.
 */
export const site = {
	get centroid() {
		return weightedCentroid(buildings);
	},
	get totalOEF() {
		return totalOEF(buildings);
	},
	get selected() {
		return buildings.find((b) => b.id === appState.selectedId) ?? null;
	},
};

// --- Actions ---

/**
 * Creates a building at the given position and selects it so the form panel
 * opens on it immediately.
 * @param {number} lat
 * @param {number} lng
 * @param {object} [overrides] seed fields, used when restoring from a permalink
 * @returns {string} the new building's id
 */
export function addBuilding(lat, lng, overrides = {}) {
	const id = crypto.randomUUID();
	const number = nextBuildingNumber++;

	buildings.push({
		id,
		...DEFAULT_BUILDING,
		name: `Building ${number}`,
		lat,
		lng,
		...overrides,
	});

	appState.selectedId = id;
	return id;
}

export function removeBuilding(id) {
	const index = buildings.findIndex((b) => b.id === id);
	if (index === -1) return;
	buildings.splice(index, 1);
	if (appState.selectedId === id) appState.selectedId = null;
}

export function selectBuilding(id) {
	appState.selectedId = id;
}

/**
 * Selects a building and flies the map camera to it. Used by menu-driven
 * selection (buildings table, quick list) where the building may be off
 * screen - clicking a marker on the map already has it in view, so that
 * path uses selectBuilding() directly and leaves the camera alone.
 */
export function focusBuilding(id) {
	selectBuilding(id);

	const building = buildings.find((b) => b.id === id);
	if (!building) return;

	appState.location.lat = building.lat;
	appState.location.lng = building.lng;
	appState.location.fly = true;
}

/**
 * Switches a building's odor source type, clearing the fields that belong to
 * the type it is leaving. Without the wipe a building could keep a species
 * selection that no longer contributes to its (now storage-based) OEF.
 */
export function setBuildingType(id, formType) {
	const building = buildings.find((b) => b.id === id);
	if (!building || building.formType === formType) return;

	for (const key of TYPE_SPECIFIC_FIELDS[building.formType] ?? [])
		building[key] = DEFAULT_BUILDING[key];

	building.formType = formType;
}

/** Clears a building's emission inputs but keeps its identity and position. */
export function clearBuildingFields(id) {
	const building = buildings.find((b) => b.id === id);
	if (!building) return;

	for (const key of Object.keys(DEFAULT_BUILDING)) {
		if (key === "name" || key === "formType") continue;
		building[key] = DEFAULT_BUILDING[key];
	}
}

/** Replaces every building - used when a permalink is decoded. */
export function replaceBuildings(next) {
	buildings.splice(0, buildings.length, ...next);
	appState.selectedId = null;
	nextBuildingNumber = buildings.length + 1;
}
