import { appState } from "$lib/stores/appState.svelte.js";

/**
 * Fetches the geoJSON from mapLayer file
 * Returns the GeoJSON layer so the caller can remove it later.
 */
export async function renderGEOJSON(map) {
	if (!map) {
		console.error("Cannot render GeoJSON, map is undefined");
		return;
	}

	const lineWeight = 2;
	// tailwind RGB values
	const RED = "#ef4444";
	const GREEN = "#22c55e";
	const BLUE = "#3b82f6";
	const colors = [RED, BLUE, GREEN];

	window.L = (await import("leaflet")).default;
	let geoJSON = appState.geoJSONData.outputs.map.data;
	let geoJSONLayer = L.geoJSON(geoJSON.features).addTo(map);

	geoJSONLayer.eachLayer((l) => {
		if (!l.setStyle) return;
		const name = l.feature?.properties?.name ?? null;
		l.setStyle({ weight: lineWeight, color: colors.pop() });

		if (name)
			l.bindTooltip(name, {
				sticky: true,
				direction: "top",
			});

		l.on("mouseover", () => l.setStyle({ weight: lineWeight + 2 }));
		l.on("mouseout", () => l.setStyle({ weight: lineWeight }));
	}); // makes the borders super thin and represent better bounds upon zooming out

	// centers the kml bounds on the map view
	const bounds = geoJSONLayer.getBounds();
	map.fitBounds(bounds);
	return geoJSONLayer;
}
