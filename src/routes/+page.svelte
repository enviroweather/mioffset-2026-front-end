<script>
	// --- Imports ---
	import { onMount } from "svelte";
	import MapView from "$lib/components/location/MapView.svelte";
	import EmissionForm from "$lib/components/entries/EmissionForm.svelte";
	import EntriesTable from "$lib/components/entries/EntriesTable.svelte";
	import FootprintTable from "$lib/components/results/FootprintTable.svelte";
	import { appState, entries } from "$lib/state/appState.svelte.js";
	import { encodeState, decodeState } from "$lib/utils/permalink.js";
	import { getAndRun } from "$lib/utils/model/runModel.svelte.ts";

	// Parsed here (not in onMount) so appState.location.lat/lng are set and focusOnMount
	// is correct before MapView mounts. Moving this into onMount would cause MapView to
	// render at default coordinates first, then jump to the permalink location.
	const decodedState = decodeState(
		new URLSearchParams(window.location.search).get("data"),
	);

	if (decodedState) {
		appState.location.lat = decodedState.location.lat;
		appState.location.lng = decodedState.location.lng;
	}

	onMount(async () => {
		if (decodedState) {
			const permalinkTotal = decodedState.entries.reduce(
				(sum, e) => sum + (e.totalEmission ?? 0),
				0,
			);
			const currentTotal = entries.reduce(
				(sum, e) => sum + (e.totalEmission ?? 0),
				0,
			);
			if (currentTotal !== permalinkTotal) {
				entries.splice(0, entries.length);
				for (const entry of decodedState.entries) {
					entries.push(entry);
				}
			}
			await getAndRun();
		}
	});

	// Keep the address bar in sync with current entries + location.
	$effect(() => {
		const encoded = encodeState(entries, appState.location);
		window.history.replaceState(null, "", `?data=${encoded}`);
	});
</script>

<div class="page-container">
	<section class="section emission-wrapper">
		<EmissionForm />
	</section>

	<section class="section map-wrapper">
		<MapView focusOnMount={decodedState} />
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
