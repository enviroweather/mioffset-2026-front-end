import { MAX_ZOOM } from "$lib/state/defaultValues.svelte.js";

// USGS National Map basemaps are public-domain ArcGIS tile caches. Two differences
// from OSM-style XYZ services:
//   - the URL template is {z}/{y}/{x} (ArcGIS row/column), not {z}/{x}/{y}
//   - the caches stop at zoom 16 nationally, so maxNativeZoom pins requests there
//     and lets Leaflet upscale for 17-18 instead of rendering blank tiles.
const USGS_ATTRIBUTION =
	'Tiles courtesy of the <a href="https://www.usgs.gov/">U.S. Geological Survey</a>';
const USGS_MAX_NATIVE_ZOOM = 16;

function usgs(service) {
	return {
		url: `https://basemap.nationalmap.gov/arcgis/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`,
		options: {
			attribution: USGS_ATTRIBUTION,
			maxNativeZoom: USGS_MAX_NATIVE_ZOOM,
			maxZoom: MAX_ZOOM,
		},
	};
}

// Keys are stored in appState.basemap; labels are what the layers control shows.
export const BASEMAPS = {
	osm: {
		label: "Street Map",
		url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		options: {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: MAX_ZOOM,
		},
	},
	usgsTopo: { label: "USGS Topo", ...usgs("USGSTopo") },
	usgsImagery: { label: "USGS Imagery", ...usgs("USGSImageryOnly") },
	usgsImageryTopo: { label: "USGS Imagery + Topo", ...usgs("USGSImageryTopo") },
	usgsRelief: { label: "USGS Shaded Relief", ...usgs("USGSShadedReliefOnly") },
};

export const DEFAULT_BASEMAP = "osm";

/** Builds the Leaflet tile layer for a basemap key, falling back to the default. */
export function createBasemapLayer(L, key) {
	const { url, options } = BASEMAPS[key] ?? BASEMAPS[DEFAULT_BASEMAP];
	return L.tileLayer(url, options);
}

/** Reverse lookup used to map a layers-control label back to its basemap key. */
export function basemapKeyFromLabel(label) {
	return (
		Object.keys(BASEMAPS).find((key) => BASEMAPS[key].label === label) ??
		DEFAULT_BASEMAP
	);
}
