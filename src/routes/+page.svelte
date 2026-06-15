<script>
	// --- Imports ---
	import { onMount } from "svelte";
	import MapView from "$lib/components/location/MapView.svelte";
	import EmissionForm from "$lib/components/entries/EmissionForm.svelte";
	import EntriesTable from "$lib/components/entries/EntriesTable.svelte";
	import FootprintTable from "$lib/components/results/FootprintTable.svelte";
	import {
		appState,
		entries,
		loadFromPermalink,
	} from "$lib/state/appState.svelte.js";
	import { getAndRun } from "$lib/utils/model/runModel.svelte.ts";

	// Parsed here (not in onMount) so appState.location.lat/lng are set and focusOnMount
	// is correct before MapView mounts. Moving this into onMount would cause MapView to
	// render at default coordinates first, then jump to the permalink location.
	const _p = new URLSearchParams(window.location.search);
	const _lat = parseFloat(_p.get("lat"));
	const _lon = parseFloat(_p.get("lon"));
	const _emissionIndex = parseFloat(_p.get("emission_index"));
	const permalink =
		!isNaN(_lat) && !isNaN(_lon) && !isNaN(_emissionIndex)
			? { lat: _lat, lon: _lon, emissionIndex: _emissionIndex }
			: null;
	if (permalink) {
		appState.location.lat = permalink.lat;
		appState.location.lng = permalink.lon;
	}

	onMount(async () => {
		if (permalink) {
			loadFromPermalink(permalink.lat, permalink.lon, permalink.emissionIndex);
			await getAndRun();
		}
	});

	// Keep the address bar in sync whenever lat, lon, or emission_index changes.
	$effect(() => {
		const { lat, lng } = appState.location;
		const emissionIndex = entries.reduce((sum, e) => {
			const data = e.type === "storage" ? e.storage : e.animal;
			return sum + (data?.totalEmission ?? 0);
		}, 0);
		const params = new URLSearchParams({
			lat,
			lon: lng,
			emission_index: emissionIndex,
		});
		window.history.replaceState(null, "", `?${params}`);
	});
</script>

<div class="page-container">
	<section class="section emission-wrapper">
		<EmissionForm />
	</section>

	<section class="section map-wrapper">
		<MapView focusOnMount={permalink} />
	</section>

	<div class="entries-wrapper">
		<EntriesTable />
		{#if appState.mapIsUpToDate}
			<FootprintTable />
		{/if}
	</div>
</div>

<style>
	/* allow for font weight resizing on chrome */
	* {
		-webkit-font-smoothing: antialiased;
	}
	/* Grid Layout */
	.page-container {
		display: grid;
		grid-template-columns: 0.5fr 2fr;
		grid-template-areas:
			"emission    map"
			"entries entries";
		gap: 0rem;
	}

	.section {
		padding: 1rem;
	}

	/* Section Wrappers */
	.entries-wrapper {
		grid-area: entries;
		display: flex;
		flex-direction: column;
		padding: 1rem;
	}
	.emission-wrapper {
		grid-area: emission;
	}
	.map-wrapper {
		grid-area: map;
	}
	/* Responsive */
	@media (max-width: 768px) {
		.page-container {
			grid-template-columns: 1fr;
			grid-template-areas:
				"emission"
				"entries"
				"map";
		}
		.entries-wrapper,
		.emission-wrapper,
		.map-wrapper {
			min-width: 0;
		}
	}
</style>
