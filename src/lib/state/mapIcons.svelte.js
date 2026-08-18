// --- Icon Definitions ---
// PascalCase keys ("Cattle", "Swine", "Poultry") match a building's species
// value from the form; "Storage" covers manure storage structures.
export const mapIcons = {
	default: {
		iconUrl: "marker.svg",
		iconSize: [30, 40],
		iconAnchor: [15, 40],
	},
	"default-fresh": {
		iconUrl: "blue-marker.svg",
		iconSize: [30, 40],
		iconAnchor: [15, 40],
	},
	Cattle: {
		iconUrl: "cattle.png",
		iconSize: [77, 50],
		iconAnchor: [38, 25],
	},
	Swine: {
		iconUrl: "swine.png",
		iconSize: [77, 50],
		iconAnchor: [38, 25],
	},
	Poultry: {
		iconUrl: "poultry.png",
		iconSize: [77, 70],
		iconAnchor: [38, 35],
	},
	Storage: {
		iconUrl: "barn.png",
		iconSize: [45, 45],
		iconAnchor: [22, 22],
	},
};

/**
 * Picks the icon key for a building from what it currently is: a species icon
 * once a species is chosen, the barn for manure storage, and the generic pin
 * while the building is still blank.
 */
export function buildingIconKey(building) {
	if (building.formType === "storage") return "Storage";
	if (building.formType === "animal" && building.species)
		return mapIcons[building.species] ? building.species : "default";
	return "default";
}

/**
 * Leaflet icon for a building marker. The selected building gets an extra
 * class so it can be highlighted in CSS - Leaflet markers live outside the
 * Svelte component tree, so the styling is applied globally in MapView.
 */
export function resolveBuildingIcon(L, building, isSelected) {
	const spec = mapIcons[buildingIconKey(building)] ?? mapIcons["default"];
	return L.icon({
		...spec,
		className: isSelected ? "building-marker is-selected" : "building-marker",
	});
}

/**
 * The odor source marker: a crosshair sitting at the emission-weighted
 * centroid. Deliberately unlike the building icons - it is a computed point,
 * not something the user can place or drag.
 */
export function createCentroidIcon(L) {
	return L.divIcon({
		className: "centroid-marker",
		iconSize: [36, 36],
		iconAnchor: [18, 18],
		html: `
			<svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
				<circle cx="18" cy="18" r="11" fill="none" stroke="#18453b" stroke-width="2.5" />
				<circle cx="18" cy="18" r="3" fill="#18453b" />
				<line x1="18" y1="1"  x2="18" y2="9"  stroke="#18453b" stroke-width="2.5" />
				<line x1="18" y1="27" x2="18" y2="35" stroke="#18453b" stroke-width="2.5" />
				<line x1="1"  y1="18" x2="9"  y2="18" stroke="#18453b" stroke-width="2.5" />
				<line x1="27" y1="18" x2="35" y2="18" stroke="#18453b" stroke-width="2.5" />
			</svg>`,
	});
}
