<script>
	// --- Imports ---
	import { onMount } from "svelte";
	import MapView from "$lib/components/location/MapView.svelte";
	import EmissionForm from "$lib/components/emission/EmissionForm.svelte";
	import EntriesTable from "$lib/components/entries/EntriesTable.svelte";
	import FootprintTable from "$lib/components/results/FootprintTable.svelte";
	import {
		appState,
		entries,
		loadFromEntriesPermalink,
	} from "$lib/stores/appState.svelte.js";
	import { encodeState, decodeState } from "$lib/utils/permalink.js";

	// Parsed here (not in onMount) so appState.location.lat/lng are set and focusOnMount
	// is correct before MapView mounts. Moving this into onMount would cause MapView to
	// render at default coordinates first, then jump to the permalink location.
	const decodedState = decodeState(
		new URLSearchParams(window.location.search).get("d"),
	);

	if (decodedState) {
		appState.location.lat = decodedState.location.lat;
		appState.location.lng = decodedState.location.lng;
	}

	// Deferred to onMount because fetchResults uses a relative URL (/api/forecast)
	// that requires the SvelteKit runtime to be active.
	onMount(async () => {
		if (decodedState) {
			await loadFromEntriesPermalink(
				decodedState.entries,
				decodedState.location,
			);
		}
	});

	// Keep the address bar in sync with current entries + location.
	$effect(() => {
		const encoded = encodeState(entries, appState.location);
		window.history.replaceState(null, "", `?d=${encoded}`);
	});
</script>

<div class="page-container">
	<section class="section odor-wrapper">
		<EmissionForm />
	</section>

	<section class="section location-wrapper">
		<MapView focusOnMount={decodedState} />
		{#if appState.mapIsUpToDate}
			<FootprintTable />
		{/if}
	</section>
	<div class="entries-wrapper">
		<EntriesTable />
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
		grid-template-columns: 0.5fr 1fr;
		grid-template-areas:
			"odor    map"
			"entries entries";
		gap: 0rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		padding: 1rem;
	}

	/* Section Wrappers */
	.entries-wrapper {
		grid-area: entries;
		padding: 1rem;
	}
	.odor-wrapper {
		grid-area: odor;
	}
	.location-wrapper {
		grid-area: map;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.page-container {
			grid-template-columns: 1fr;
			grid-template-areas:
				"odor"
				"entries"
				"map";
		}
		.entries-wrapper,
		.odor-wrapper,
		.location-wrapper {
			min-width: 0;
		}
	}
</style>
