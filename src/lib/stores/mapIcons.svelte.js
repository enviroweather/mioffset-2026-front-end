// --- Icon Definitions ---
// PascalCase keys ("Cattle", "Swine", "Poultry") match appState.odor.species values from the form.
export const mapIcons = $state({
	"default": {
		iconUrl: "marker.svg",
		iconSize: [30, 40],
		iconAnchor: [15, 40],
	},
	"default-fresh": {
		iconUrl: "marker-blue.svg",
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
	}
});
