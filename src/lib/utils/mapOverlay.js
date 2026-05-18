/**
 * Fetches a KML file and renders it on the map via the leaflet-kml plugin.
 * Returns the KML layer so the caller can remove it later.
 */
export async function renderKML(map, url, weight = 2) {
	// leaflet-kml references the global L — expose it before importing the plugin
	window.L = (await import("leaflet")).default;
	await import("leaflet-kml");
	const res = await fetch(url);
	const text = await res.text();
	const xml = new DOMParser().parseFromString(text, "text/xml");
	const layer = new window.L.KML(xml);
	map.addLayer(layer);
	layer.eachLayer((l) => {
		if (l.setStyle) l.setStyle({ weight });
	}); // makes the borders super thin and represent better bounds upon zooming out

	// adjust map to show the full kml
    const bounds = layer.getBounds();
    map.fitBounds(bounds);
	return layer;
}