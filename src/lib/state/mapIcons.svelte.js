// --- Icon Definitions ---
// PascalCase keys ("Cattle", "Swine", "Poultry") match appState.odor.species values from the form.
export const mapIcons = $state({
	"default": {
		iconUrl: "marker.svg",
		iconSize: [30, 40],
		iconAnchor: [15, 40],
	},
	"default-fresh": {
		iconUrl: "blue-marker.svg",
		iconSize: [30, 40],
		iconAnchor: [15, 40],
	},
	"Cattle": {
		iconUrl: "cattle.png",
		iconSize: [77, 50],
		iconAnchor: [38, 25],
	},
	"Swine": {
		iconUrl: "swine.png",
		iconSize: [77, 50],
		iconAnchor: [38, 25],
	},
	"Poultry": {
		iconUrl: "poultry.png",
		iconSize: [77, 70],
		iconAnchor: [38, 35],
	},
	"Storage": {
		iconUrl: "barn.png",
		iconSize: [45],
		iconAnchor: [38, 35],
	}
});

export function resolveMarkerIcon(L, species, isUpToDate) {
	const mapFresh = isUpToDate ? "default-fresh" : "default";
	const key = species !== "default" && !isUpToDate ? species : mapFresh;
	return L.icon(mapIcons[key] ?? mapIcons["default"]);
}
