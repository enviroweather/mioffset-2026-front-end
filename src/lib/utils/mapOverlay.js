// --- Constants ---
const METERS_PER_MILE = 1609.344;
const METERS_PER_DEG_LAT = 111139;

// --- Bounds Calculation ---
function overlayBounds(lat, lng, radiusMiles) {
    const latDelta = (radiusMiles * METERS_PER_MILE) / METERS_PER_DEG_LAT;
    const lngDelta = latDelta / Math.cos(lat * Math.PI / 180);
    return [
        [lat - latDelta, lng - lngDelta],
        [lat + latDelta, lng + lngDelta],
    ];
}

// --- SVG Builders ---

/**
 * Builds a placeholder concentric-circles SVG with rings at
 * 0.1, 0.2, 0.5, and 1 mile. Returns an SVGElement ready for L.svgOverlay.
 */
export function createFootprintSVG() {
    const rings = [
        { r: 0.1, label: '0.1 mi' },
        { r: 0.2, label: '0.2 mi' },
        { r: 0.5, label: '0.5 mi' },
        { r: 1.0, label: '1 mi'   },
    ];

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('xmlns', ns);
    svg.setAttribute('viewBox', '-1.15 -1.15 2.3 2.3');
    // none — lets Leaflet stretch the SVG to match the geographic bounds exactly
    svg.setAttribute('preserveAspectRatio', 'none');

    for (const { r, label } of rings) {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', '0');
        circle.setAttribute('cy', '0');
        circle.setAttribute('r', String(r));
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'rgba(76, 175, 80, 0.7)');
        circle.setAttribute('stroke-width', '0.015');
        svg.appendChild(circle);

        const text = document.createElementNS(ns, 'text');
        text.setAttribute('x', '0');
        text.setAttribute('y', String(-(r + 0.04)));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '0.05');
        text.setAttribute('fill', 'rgba(44, 62, 80, 0.85)');
        text.setAttribute('stroke', 'white');
        text.setAttribute('stroke-width', '0.015');
        text.setAttribute('paint-order', 'stroke');
        text.textContent = label;
        svg.appendChild(text);
    }

    return svg;
}

// --- Overlay Placement ---

/**
 * Places an SVG element on the Leaflet map anchored to lat/lng.
 * radiusMiles sets the geographic extent of the overlay (outermost ring).
 * Returns the L.svgOverlay layer so the caller can remove or replace it.
 */
export function placeOverlay(L, map, svgEl, lat, lng, radiusMiles = 1) {
    const bounds = overlayBounds(lat, lng, radiusMiles);
    return L.svgOverlay(svgEl, bounds, { opacity: 1, interactive: false }).addTo(map);
}
