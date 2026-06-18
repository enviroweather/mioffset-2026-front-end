import { tick } from "svelte";
import {
	geodeticDistance,
	closestGridPoint,
} from "$lib/utils/model/fodLocalModel/geo.js";

import {
	WindData,
	type WindDataRecord,
} from "$lib/utils/model/fodLocalModel/windData";

import {
	legacyFodModel,
	type ModelOutput,
} from "$lib/utils/model/fodLocalModel/fodModel";

import { appState, entries } from "$lib/state/appState.svelte.js";

// ── location (reactive from appState) ─────────────────────────────────────
let Lat = $derived(appState.location.lat);
let Lon = $derived(appState.location.lng);

// ── wind data ─────────────────────────────────────────────────────────────
let gridX = $state<number | null>(null);
let gridY = $state<number | null>(null);
let windData = $state<WindDataRecord | null>(null);
let flattenedByDataset = $derived(
	windData ? WindData.flattenAll(windData) : null,
);
let errorMsg = $state("");

// ── GeoJSON builder (written by copoilet, trust with caution) ────────────

// Each of the 80 model rows corresponds to a bearing at 4.5° increments
// clockwise from North (row 0 = N = 0°, row 5 = NNE = 22.5°, …).
const ROW_BEARINGS = Array.from({ length: 80 }, (_, i) => i * 4.5);

function buildGeoJSONData(
	result: ModelOutput,
	lat: number,
	lon: number,
	E: number,
) {
	const thresholds = [
		{ col: 0, name: "1.5% Frequency" },
		{ col: 1, name: "3% Frequency" },
		{ col: 2, name: "5% Frequency" },
	];

	const features = thresholds.map(({ col, name }) => {
		const ring: [number, number][] = ROW_BEARINGS.map((bearing, i) => {
			const point = geodeticDistance(lat, lon, result.D[i][col], bearing);
			return [point.lon, point.lat]; // GeoJSON is [lon, lat]
		});
		ring.push(ring[0]); // close the polygon
		return {
			type: "Feature" as const,
			properties: { name, odor_emission_factor: E },
			geometry: { type: "Polygon" as const, coordinates: [ring] },
		};
	});

	// Table rows: label + 3 threshold distances, space-separated.
	// FootprintTable.svelte slices off the first 2 header lines then splits
	// each remaining line on whitespace to get [direction, pct5, pct3, pct1_5].
	const tableRows = result.setbackTable
		.map(
			(r) =>
				`${r.label}  ${r.d5pct.toFixed(2)}  ${r.d3pct.toFixed(2)}  ${r.d1_5pct.toFixed(2)}`,
		)
		.join("\n");

	return {
		sourceLat: lat,
		sourceLng: lon,
		outputs: {
			map: { data: { type: "FeatureCollection", features } },
			table: { data: `Toward  Distance_in_Miles\n5%  3%  1.5%\n${tableRows}` },
		},
	};
}

// ── internal helpers ──────────────────────────────────────────────────────

function updateGridCoords() {
	const result = closestGridPoint(Lat, Lon);
	gridX = result[0];
	gridY = result[1];
}

async function fetchWindData() {
	errorMsg = "";
	windData = null;

	const x = gridX;
	const y = gridY;

	if (x === null || x < 0 || x > 276) {
		errorMsg = "Grid X must be an integer between 0 and 276.";
		return;
	}
	if (y === null || y < 0 || y > 348) {
		errorMsg = "Grid Y must be an integer between 0 and 348.";
		return;
	}

	try {
		const res = await fetch(`/api/wind?x=${x}&y=${y}`);
		const body = await res.json();
		if (!res.ok) {
			errorMsg = body.error ?? `Server error ${res.status}`;
			return;
		}
		windData = body as WindDataRecord;
	} catch (err) {
		errorMsg =
			err instanceof Error ? err.message : "Unknown error fetching data.";
	}
}

function runModelSync(E: number): Promise<ModelOutput | null> {
	if (!flattenedByDataset) return Promise.resolve(null);

	// Yield to the browser so the spinner can paint before the synchronous
	// model computation blocks the main thread.
	return new Promise((resolve) => {
		setTimeout(() => {
			try {
				resolve(
					legacyFodModel(
						flattenedByDataset!.wd,
						flattenedByDataset!.ws,
						flattenedByDataset!.pc,
						E,
					),
				);
			} catch {
				resolve(null);
			}
		}, 0);
	});
}

// ── public API ────────────────────────────────────────────────────────────

/**
 * Fetches wind data for the current location, runs the local FOD model,
 * and writes the result into appState.geoJSONData in the shape the rest
 * of the app expects (outputs.map.data and outputs.table.data).
 */
export async function getAndRun() {
	if (appState.mapIsUpToDate) return;
	appState.mapLoading = true;

	try {
		const E = (entries as any[]).reduce((sum: number, e: any) => {
			const data = e.type === "storage" ? e.storage : e.animal;
			return sum + (data?.totalEmission ?? 0);
		}, 0);

		if (E <= 0) return;

		updateGridCoords();
		await fetchWindData();
		if (errorMsg) return;

		const result = await runModelSync(E);
		if (!result) return;

		appState.geoJSONData = buildGeoJSONData(result, Lat, Lon, E);
		// tick() lets geoJSONData propagate before mapIsUpToDate = true triggers
		// the MapView effect that calls showGeoJSONLayer().
		await tick();
		appState.mapIsUpToDate = true;
	} finally {
		appState.mapLoading = false;
	}
}
