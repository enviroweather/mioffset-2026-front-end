/**
 * Fetches a KML file and renders it on the map via the leaflet-kml plugin.
 * Returns the KML layer so the caller can remove it later.
 */
export async function renderKML(map, url, weight = 2) {
	// leaflet-kml references the global L - expose it before importing the plugin
	window.L = (await import("leaflet")).default;
	await import("leaflet-kml");
	const res = await fetch(url);
	const text = await res.text();
	const xml = new DOMParser().parseFromString(text, "text/xml");
	const layer = new window.L.KML(xml);
	map.addLayer(layer);
	layer.eachLayer((l) => {
		if (!l.setStyle) return;
		l.setStyle({ weight }); // pass the weight so the outline isn't too large

		// leaflet-kml binds a popup with <h2>name</h2> from the KML <name> tag; extract it for the tooltip
		const popupContent = l.getPopup()?.getContent();
		const name =
			typeof popupContent === "string"
				? (popupContent.match(/<h2>(.*?)<\/h2>/)?.[1] ?? null)
				: null;
		if (name)
			l.bindTooltip("IN DEVELOPMENT TEST KML: " + name, {
				sticky: true,
				direction: "top",
			});

		l.on("mouseover", () => l.setStyle({ weight: weight + 2 }));
		l.on("mouseout", () => l.setStyle({ weight: weight }));
		// KML layers absorb clicks; this pushes through a click on the map so the location-selection handler still triggers
		l.on("click", (e) => map.fire("click", e));
	}); // makes the borders super thin and represent better bounds upon zooming out

	// centers the kml bounds on the map view
	const bounds = layer.getBounds();
	map.fitBounds(bounds);
	return layer;
}
