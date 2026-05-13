<script>
	import ManualCoords from "$lib/components/location/ManualCoords.svelte";

	import { onMount, onDestroy } from "svelte";
	import { appState } from "$lib/stores/appState.svelte.js";
	import { mapIcons } from "$lib/stores/mapIcons.svelte.js";
	import {
		DEFAULT_LAT,
		DEFAULT_LNG,
	} from "$lib/stores/defaultValues.svelte.js";
	import AddressSearch from "./AddressSearch.svelte";
	import LocationSelection from "./LocationSelection.svelte";

	let { onLocationSelect = () => {} } = $props();
	let currentSpecies = $derived(appState.odor.species || "default");
	let L = $state();
	let mapContainer = $state();
	let map = $state();
	let marker = $state();
	let overlayEl;

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

		// marker = L.marker({lat: DEFAULT_LAT, lng: DEFAULT_LNG}, { icon: mapIcons[currentSpecies] }).addTo(map);

		map.on("click", (e) => {
			let { lat, lng } = e.latlng;
			let customIcon = L.icon(mapIcons[currentSpecies]);

			if (marker) {
				marker.setLatLng(e.latlng);
			} else {
				marker = L.marker(e.latlng, { icon: customIcon }).addTo(map);
			}

			appState.location.lat = lat;
			appState.location.lng = lng;
			onLocationSelect({ lat, lng });
		});

		// Set up resize observer after map is ready
		const observer = new ResizeObserver(() => {
			map.invalidateSize();
		});
		observer.observe(mapContainer);
	});

	onDestroy(() => {
		map?.remove();
	});

	// Updates upon window resize + lack of observer
	$effect(() => {
		if (!mapContainer || !map) return;

		const observer = new ResizeObserver(() => {
			map.invalidateSize();
		});

		observer.observe(mapContainer);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (!L || !map) return;

		const lat = appState.location.lat;
		const lng = appState.location.lng;
		const icon = L.icon(mapIcons[currentSpecies]);

		if (marker) {
			marker.setLatLng({ lat, lng });
		} else {
			marker = L.marker({ lat, lng }).addTo(map);
		}
		marker.setIcon(icon);
		map.setView({ lat, lng });
	});
</script>

<div bind:this={mapContainer} class="map">
	<div class="overlay" bind:this={overlayEl}>
		<LocationSelection></LocationSelection>
	</div>
</div>

<style>
	.map {
		width: 100%;
		height: 100%;
		position: relative;
		min-height: 450px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
	.overlay {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		z-index: 1000; /* must be above Leaflet's panes */
		background: white;
		border: 1px, solid, var(--color-kelly-green);
		padding: 0.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}
</style>
