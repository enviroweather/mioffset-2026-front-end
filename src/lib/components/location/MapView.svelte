<script>
	// --- Imports ---
	import { onMount, onDestroy } from "svelte";
	import { appState } from "$lib/stores/appState.svelte.js";
	import { mapIcons } from "$lib/stores/mapIcons.svelte.js";
	import {
		DEFAULT_LAT,
		DEFAULT_LNG,
	} from "$lib/stores/defaultValues.svelte.js";
	import LocationSelection from "./LocationSelection.svelte";
	import { createFootprintSVG, placeOverlay } from "$lib/utils/mapOverlay.js";

	// --- Props & State ---
	let { onLocationSelect = () => {} } = $props();
	let currentSpecies = $derived(appState.odor.species || "default");
	let L = $state();
	let mapContainer = $state();
	let map = $state();
	// Non-reactive — managed manually to avoid effect loops
	let marker;
	let overlayEl;
	let svgOverlay;

	// --- Lifecycle ---
	onMount(async () => {
		L = (await import("leaflet")).default;
		await import("leaflet/dist/leaflet.css");

		L.DomEvent.disableClickPropagation(overlayEl);
		L.DomEvent.disableScrollPropagation(overlayEl);
		map = L.map(mapContainer).setView([DEFAULT_LAT, DEFAULT_LNG], 200);

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 18,
		}).addTo(map);

		map.on("click", (e) => {
			let { lat, lng } = e.latlng;
			appState.location.lat = lat;
			appState.location.lng = lng;
			appState.location.hasSelection = true;
			onLocationSelect({ lat, lng });
		});

		svgOverlay = placeOverlay(L, map, createFootprintSVG(), appState.location.lat, appState.location.lng);
	});

	onDestroy(() => {
		map?.remove();
	});

	// --- Effects ---
	$effect(() => {
		if (!mapContainer || !map) return;

		const observer = new ResizeObserver(() => {
			map.invalidateSize();
		});

		observer.observe(mapContainer);
		return () => observer.disconnect();
	});

	// Sync current (in-progress) marker with appState
	$effect(() => {
		if (!L || !map) return;

		if (!appState.location.hasSelection) {
			if (marker) {
				marker.remove();
				marker = null;
			}
			map.setView([DEFAULT_LAT, DEFAULT_LNG]);
			return;
		}

		const lat = appState.location.lat;
		const lng = appState.location.lng;
		const icon = L.icon(mapIcons[currentSpecies] ?? mapIcons["default"]);

		if (marker) {
			marker.setLatLng({ lat, lng });
			marker.setIcon(icon);
		} else {
			marker = L.marker({ lat, lng }, { icon }).addTo(map);
		}
		map.setView({ lat, lng });
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
		bottom: 1rem;
		left: 1rem;
		z-index: 1000; /* must be above Leaflet's panes */
		background: white;
		border: 1px solid var(--color-kelly-green);
		transition: all 0.3s ease;
		padding: 0.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}
</style>
