import { deriveEmission } from "./OdorEmissionFactor.js";

/**
 * Source-weighted centroid of a set of buildings.
 *
 * Mirrors cells J33/K33 of the MI OFFSET 2018 Centroid Worksheet:
 *
 *   lat = Σ(latᵢ · OEFᵢ) / Σ(OEFᵢ)
 *   lng = Σ(lngᵢ · OEFᵢ) / Σ(OEFᵢ)
 *
 * where OEFᵢ is the building's Odor Emission Factor (area × OEN × OCF / 10000).
 * A building with no emission yet - blank area, or dropdowns not filled in -
 * has OEFᵢ = 0 and therefore does not move the centroid, exactly as the blank
 * rows of the worksheet do not.
 *
 * The worksheet divides by the total OEF unconditionally and shows #DIV/0!
 * when nothing is entered. We instead fall back to the plain mean of the
 * placed buildings so the source marker still has somewhere to sit while the
 * user is partway through data entry. The model is not run in that state
 * (total emission is zero), so the fallback only ever drives the map preview.
 *
 * Coordinates are averaged in the planar lat/lng domain. Over a single
 * livestock facility - the worksheet defines one as everything within 1,000 ft
 * under common ownership - the difference from a true geodesic centroid is far
 * below the 6-decimal-place precision the worksheet asks for.
 *
 * Emission is derived from each building's raw inputs rather than read from a
 * stored field, so the centroid can never drift out of sync with the form.
 *
 * @param {Array<object>} buildings
 * @returns {{lat: number, lng: number, weighted: boolean}|null} null when there
 *   are no placed buildings at all.
 */
export function weightedCentroid(buildings) {
	const placed = buildings.filter(
		(b) => Number.isFinite(b.lat) && Number.isFinite(b.lng),
	);
	if (placed.length === 0) return null;

	let weightSum = 0;
	let latSum = 0;
	let lngSum = 0;

	for (const b of placed) {
		const weight = deriveEmission(b).totalEmission ?? 0;
		if (!(weight > 0)) continue;
		weightSum += weight;
		latSum += b.lat * weight;
		lngSum += b.lng * weight;
	}

	if (weightSum > 0) {
		return { lat: latSum / weightSum, lng: lngSum / weightSum, weighted: true };
	}

	// No building carries an emission yet - unweighted mean keeps the marker sane.
	return {
		lat: placed.reduce((sum, b) => sum + b.lat, 0) / placed.length,
		lng: placed.reduce((sum, b) => sum + b.lng, 0) / placed.length,
		weighted: false,
	};
}

/**
 * Total Odor Emission Factor for the site - cell K32 of the worksheet, the
 * value the legacy workflow had the user retype into the online tool's manual
 * entry tab.
 * @param {Array<object>} buildings
 */
export function totalOEF(buildings) {
	return buildings.reduce(
		(sum, b) => sum + (deriveEmission(b).totalEmission ?? 0),
		0,
	);
}
