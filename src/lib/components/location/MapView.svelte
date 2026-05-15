<script>
	// --- Imports ---
	import { onMount, onDestroy } from "svelte";
	import { appState, entries } from "$lib/stores/appState.svelte.js";
	import { mapIcons } from "$lib/stores/mapIcons.svelte.js";
	import {
		DEFAULT_LAT,
		DEFAULT_LNG,
		LANDMARK_ZOOM,
		MAX_ZOOM,
		MIN_ZOOM,
	} from "$lib/stores/defaultValues.svelte.js";
	import LocationSelection from "./LocationSelection.svelte";
	import { createFootprintSVG, placeOverlay } from "$lib/utils/mapOverlay.js";

	// --- Props & State ---
	let { onLocationSelect = () => {} } = $props();
	let currentSpecies = $derived(appState.odor.species || "default");
	let L = $state();
	let mapContainer = $state();
	let map = $state();
	// Non-reactive - managed manually to avoid effect loops
	let marker;
	let overlayEl;
	let svgOverlay;
	let navigating = false;
	let initialized = false;

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
			maxBoundsViscosity: 1.0,
		});
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);
		map.fitBounds(michiganBounds);
		appState.location.zoom = map.getZoom(); // sync so MIN_ZOOM condition works on first click
		// Prevent the location overlay from panning/zooming the map underneath it
		L.DomEvent.disableClickPropagation(overlayEl);
		L.DomEvent.disableScrollPropagation(overlayEl);
	}

	function registerMapEvents() {
		map.on("click", (e) => {
			const { lat, lng } = e.latlng;
			appState.location.lat = lat;
			appState.location.lng = lng;
			appState.location.hasSelection = true;
			onLocationSelect({ lat, lng });
		});
		map.on("zoom", () => {
			appState.location.zoom = map.getZoom();
		});
	}

	// --- SVG Overlay helpers ---
	function showSVGOverlay() {
		if (!L || !map || !appState.location.hasSelection) return;
		if (svgOverlay) map.removeLayer(svgOverlay);
		svgOverlay = placeOverlay(
			L,
			map,
			createFootprintSVG(),
			appState.location.lat,
			appState.location.lng,
		);
	}

	function clearSVGOverlay() {
		if (!svgOverlay) return;
		map.removeLayer(svgOverlay);
		svgOverlay = null;
	}

	// --- Effects ---

	// Keep map sized correctly when its container resizes
	$effect(() => {
		if (!mapContainer || !map) return;
		const observer = new ResizeObserver(() => map.invalidateSize());
		observer.observe(mapContainer);
		return () => observer.disconnect();
	});

	// Show/hide SVG footprint based on whether results are up to date
	$effect(() => {
		if (appState.mapIsUpToDate) showSVGOverlay();
		else clearSVGOverlay();
	});

	// Mark results stale whenever entries or the selected location change
	$effect(() => {
		void entries.length;
		void appState.location.lat;
		void appState.location.lng;
		appState.mapIsUpToDate = false;
	});

	// Sync the in-progress marker position and icon with appState
	$effect(() => {
		if (!L || !map) return;

		if (!appState.location.hasSelection) {
			marker?.remove();
			marker = null;
			clearSVGOverlay();
			map.setView([DEFAULT_LAT, DEFAULT_LNG]);
			return;
		}

		const { lat, lng } = appState.location;
		const defaultIcon = appState.mapIsUpToDate ? "default-fresh" : "default";
		const iconKey = currentSpecies !== "default" ? currentSpecies : defaultIcon;
		const icon = L.icon(mapIcons[iconKey] ?? mapIcons["default"]);

		if (marker) {
			marker.setLatLng({ lat, lng });
			marker.setIcon(icon);
		} else marker = L.marker({ lat, lng }, { icon }).addTo(map);

		if (!initialized) { initialized = true; return; }
		if (navigating) return;
		if (appState.location.zoom === MIN_ZOOM) {
			navigating = true;
			map.flyTo({ lat, lng }, LANDMARK_ZOOM, { duration: 1.5 });
			map.once("moveend", () => { navigating = false; });
		} else {
			map.panTo({ lat, lng });
		}
	});
</script>

<!-- Map Container -->
<div bind:this={mapContainer} class="map">
	<!-- Location Overlay -->
	<div class="overlay" bind:this={overlayEl}>
		<LocationSelection></LocationSelection>
	</div>
</div>

<style>
	/* Map Container */
	.map {
		width: 100%;
		height: 100%;
		position: relative;
		min-height: 450px;
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
