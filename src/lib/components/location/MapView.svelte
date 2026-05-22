<script>
	// --- Imports ---
	import { onMount, onDestroy, untrack } from "svelte";
	import { appState, entries } from "$lib/stores/appState.svelte.js";
	import { mapIcons } from "$lib/stores/mapIcons.svelte.js";
	import {
		LANDMARK_ZOOM,
		MAX_ZOOM,
		MIN_ZOOM,
	} from "$lib/stores/defaultValues.svelte.js";
	import LocationSelection from "./LocationSelection.svelte";
	import { renderGEOJSON } from "$lib/utils/mapRenderLayers.js";

	// --- Props & State ---
	let {
		onLocationSelect = () => {},
		enableNav = true,
		focusOnMount = false,
		interactive = true,
	} = $props();

	let currentSpecies = $derived(
		appState.formDrafts.animal.species || "default",
	);
	let L = $state.raw(null);
	let mapContainer = $state(null);
	let map = $state.raw(null);
	let geoOverlay = $state(null);

	// Non-reactive - managed manually to avoid effect loops
	let marker;
	let kmlLayer;
	let geoJSONLayer;
	let navigating = false;
	let initialized = false;
	let staleEffectMounted = false;
	let geoJSONInFlight = false;

	// --- Lifecycle ---
	onMount(async () => {
		L = (await import("leaflet")).default;
		await import("leaflet/dist/leaflet.css");
		initMap();
		registerMapEvents();
	});

	onDestroy(() => map?.remove());

	function initMap() {
		const michiganBounds = L.latLngBounds(
			L.latLng(41.55, -90.5),
			L.latLng(48.3, -82.4),
		);

		map = L.map(mapContainer, {
			minZoom: MIN_ZOOM,
			maxZoom: MAX_ZOOM,
			maxBounds: michiganBounds,
			maxBoundsViscosity: 1.0, // 1.0 = fully rigid boundary, no rubber-band when panning to the edge
		});

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);
		map.fitBounds(michiganBounds);
		appState.location.zoom = map.getZoom(); // sync so first click zooms in

		// Prevent the location overlay from panning/zooming the map underneath it
		if (geoOverlay) {
			L.DomEvent.disableClickPropagation(geoOverlay);
			L.DomEvent.disableScrollPropagation(geoOverlay);
		}
	}

	function registerMapEvents() {
		if (!interactive) return;

		map.on("click", (e) => {
			const { lat, lng } = e.latlng;
			appState.location.lat = lat;
			appState.location.lng = lng;
			onLocationSelect({ lat, lng });
		});
		map.on("zoom", () => {
			appState.location.zoom = map.getZoom();
		});
	}

	// --- KML Layer ---

	async function showKMLLayer() {
		clearKMLLayer();
		kmlLayer = await renderKML(map, "/test_kml_file.kml");
	}

	function clearKMLLayer() {
		if (!kmlLayer) return;
		map.removeLayer(kmlLayer);
		kmlLayer = null;
	}

	// --- GEOJSON Layer ---
	async function showGeoJSONLayer() {
		if (geoJSONInFlight) return;
		geoJSONInFlight = true;
		clearGeoJSONLayer();
		geoJSONLayer = await renderGEOJSON(map);
		geoJSONInFlight = false;
	}

	function clearGeoJSONLayer() {
		if (!geoJSONLayer) return;
		map.removeLayer(geoJSONLayer);
		geoJSONLayer = null;
	}

	// --- Marker ---

	function resolveMarkerIcon() {
		const freshness = appState.mapIsUpToDate ? "default-fresh" : "default";
		const key = currentSpecies !== "default" ? currentSpecies : freshness;
		return L.icon(mapIcons[key] ?? mapIcons["default"]);
	}

	function placeOrUpdateMarker(lat, lng, icon) {
		if (marker) {
			marker.setLatLng({ lat, lng });
			marker.setIcon(icon);
		} else {
			marker = L.marker({ lat, lng }, { icon }).addTo(map);
		}
	}

	function navigateToLocation(lat, lng) {
		if (navigating) return;
		// untrack: reads zoom without creating an effect dependency - changes in zoom shouldn't run the effect
		let zoom = untrack(() => appState.location.zoom);
		if (zoom === MIN_ZOOM) {
			navigating = true;
			map.flyTo({ lat, lng }, LANDMARK_ZOOM, { duration: 1.5 });
			map.once("moveend", () => {
				navigating = false;
			});
		} else {
			map.panTo({ lat, lng });
		}
	}

	// --- Effects ---

	// Keep map div sized correctly upon container resize
	$effect(() => {
		if (!mapContainer || !map) return;
		const observer = new ResizeObserver(() => map.invalidateSize());
		observer.observe(mapContainer);
		return () => observer.disconnect();
	});

	// Show/hide GeoJSON layer based on whether results are up to date
	$effect(() => {
		if (!map) return;
		if (appState.mapIsUpToDate) {
			showGeoJSONLayer();
		} else clearGeoJSONLayer();
	});

	// Mark results stale whenever entries or the selected location change
	// Skip the initial run so navigating back doesn't wipe a valid mapIsUpToDate
	$effect(() => {
		void entries.length;
		void appState.location.lat;
		void appState.location.lng;
		if (!staleEffectMounted) {
			staleEffectMounted = true;
			return;
		}
		appState.mapIsUpToDate = false;
	});

	// Sync marker position, icon, and camera with appState
	$effect(() => {
		if (!L || !map) return;
		const { lat, lng } = appState.location;
		placeOrUpdateMarker(lat, lng, resolveMarkerIcon());

		// skip navigation on first placement unless focusOnMount is set
		if (!initialized) {
			initialized = true;
			if (focusOnMount) navigateToLocation(lat, lng);
			return;
		}
		navigateToLocation(lat, lng);
	});
</script>

<!-- Map Container -->
<div bind:this={mapContainer} class="map">
	<!-- Location Overlay -->
	{#if enableNav}
		<div class="overlay" bind:this={geoOverlay}>
			<LocationSelection />
		</div>
	{/if}
</div>

<style>
	/* Map Container */
	.map {
		width: 100%;
		min-height: 700px;
		height: 100%;
		position: relative;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	/* Location Overlay */
	.overlay {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 1000; /* must be above Leaflet's panes */
		background: white;
		border: 1px solid var(--color-kelly-green);
		transition: all 0.3s ease;
		padding: 0.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		max-width: 320px;
		width: max-content;
	}
</style>
