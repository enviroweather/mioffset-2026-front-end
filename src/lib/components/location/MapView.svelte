<script>
	import { onMount, onDestroy } from "svelte";
	import { appState } from "$lib/stores/appState.svelte.js";
	import { mapIcons } from "$lib/stores/mapIcons.svelte.js";

	let { markerSrc = "/cattle.png", onLocationSelect = () => {} } = $props();

	let mapContainer = $state();
	let map;
	let marker;

	onMount(async () => {
		const L = (await import("leaflet")).default;
		await import("leaflet/dist/leaflet.css");

		map = L.map(mapContainer).setView(
			[42.72927458118972, -84.47281270368809],
			200,
		);

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 18,
		}).addTo(map);

		const customIcon = L.icon(mapIcons.default);
		map.on("click", (e) => {
			const { lat, lng } = e.latlng;

			if (marker) {
				marker.setLatLng(e.latlng);
			} else {
				marker = L.marker(e.latlng, { icon: customIcon }).addTo(map);
			}

			appState.location.lat = lat;
			appState.location.lng = lng;
			onLocationSelect({ lat, lng });
		});
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div bind:this={mapContainer} class="map"></div>

<style>
	.map {
		width: 100%;
		height: 100%;
		min-height: 450px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
</style>
