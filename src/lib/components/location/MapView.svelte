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
	import LoadingIcon from "../common/LoadingIcon.svelte";

	// --- Props & State ---
	let {
		onLocationSelect = () => {},
		enableNav = true,
		focusOnMount = false,
		interactive = true,
	} = $props();

	let currentSpecies = $derived(
		appState.formDrafts.animal.species ||
			entries?.[0]?.animal?.species ||
			"default",
	);

	let L = $state.raw(null);
	let mapContainer = $state(null);
	let map = $state.raw(null);
	let locOverlay = $state(null);
	let footprintLoading = $derived(appState.mapLoading);
	// Non-reactive - managed manually to avoid effect loops
	let marker;
	let geoJSONLayer;
	let initialized = false;
	let mapEffectBehind = false;

	// --- Lifecycle ---
	function preloadImages() {
		Object.values(mapIcons).forEach(({ iconUrl }) => {
			const img = new Image();
			img.src = iconUrl;
		});
	}

	onMount(async () => {
		L = (await import("leaflet")).default;
		await import("leaflet/dist/leaflet.css");
		preloadImages();
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

		// Prevent the location overlay (address search) from panning/zooming the map underneath it
		if (locOverlay) {
			L.DomEvent.disableClickPropagation(locOverlay);
			L.DomEvent.disableScrollPropagation(locOverlay);
		}
	}

	function registerMapEvents() {
		if (!interactive) return;

		map.on("click", (e) => {
			const { lat, lng } = e.latlng;
			appState.location.fly = true;
			appState.location.lat = lat;
			appState.location.lng = lng;
			onLocationSelect({ lat, lng });
		});
		map.on("zoom", () => {
			appState.location.zoom = map.getZoom();
		});
	}

	// --- GEOJSON Layer ---
	async function showGeoJSONLayer() {
		clearGeoJSONLayer();
		geoJSONLayer = await renderGEOJSON(map, interactive);
		appState.mapLoading = false;
	}

	function clearGeoJSONLayer() {
		if (!geoJSONLayer) return;
		geoJSONLayer._legend?.remove();
		map.removeLayer(geoJSONLayer);
		geoJSONLayer = null;
	}

	// --- Marker ---

	function resolveMarkerIcon() {
		const mapFresh = appState.mapIsUpToDate ? "default-fresh" : "default";
		const key =
			currentSpecies !== "default" && !appState.mapIsUpToDate
				? currentSpecies
				: mapFresh;
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

	function navigateToLocation(lat, lng, fly) {
		// untrack: reads zoom without creating an effect dependency
		const zoom = untrack(() => appState.location.zoom);
		const zoomedOut = zoom <= MIN_ZOOM;
		map.stop();
		if (fly) {
			zoomedOut
				? map.flyTo([lat, lng], LANDMARK_ZOOM, { duration: 1.5 })
				: map.panTo([lat, lng]);
		} else {
			map.setView([lat, lng], zoomedOut ? LANDMARK_ZOOM : zoom, {
				animate: false,
			});
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
		if (!mapEffectBehind) {
			mapEffectBehind = true;
			return;
		}
		appState.mapIsUpToDate = false;
	});

	// Sync marker position, icon, and camera with appState
	$effect(() => {
		if (!L || !map) return;
		const { lat, lng } = appState.location;
		// Read and immediately clear the fly flag without creating a dependency on it
		const fly = untrack(() => appState.location.fly);
		untrack(() => {
			appState.location.fly = false;
		});
		placeOrUpdateMarker(lat, lng, resolveMarkerIcon());

		// skip navigation on first placement unless focusOnMount is set
		if (!initialized) {
			initialized = true;
			if (focusOnMount) navigateToLocation(lat, lng, false);
			return;
		}
		navigateToLocation(lat, lng, fly);
	});
</script>

<!-- Map Container -->
<div class="map-wrapper">
	<div
		bind:this={mapContainer}
		class="map"
		class:blurred={footprintLoading || appState.location.searching}
	>
		<!-- Location Overlay -->
		{#if enableNav}
			<div class="overlay" bind:this={locOverlay}>
				<LocationSelection />
			</div>
		{/if}
	</div>

	{#if footprintLoading || appState.location.searching}
		<div class="loading-overlay">
			<LoadingIcon />
		</div>
	{/if}
</div>

<style>
	/* Map Container */
	.map-wrapper {
		position: relative;
		width: 100%;
		min-height: 700px;
		height: 100%;
	}

	.map {
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: filter 0.5s ease;
	}

	.map.blurred {
		filter: blur(4px);
		pointer-events: none;
	}

	.loading-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1001;
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
