// key value pairs used to keep track of the map icon images to use
// Key is the corresponding species
// Value is the file path
export const mapIcons = $state({
	"": {
		iconUrl: "/marker.svg",
		iconSize: [30, 40],
		iconAnchor: [15, 40],
	},
	cattle: {
		iconUrl: "cattle.png",
		iconSize: [77, 51],
		iconAnchor: [38, 51],
	},
});
