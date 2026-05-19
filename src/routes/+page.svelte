<script>
	// --- Imports ---
	import MapView from "$lib/components/location/MapView.svelte";
	import EmissionForm from "$lib/components/emission/EmissionForm.svelte";
	import EntriesTable from "$lib/components/entries/EntriesTable.svelte";
</script>

<div class="page-container">
	<div class="entries-wrapper">
		<EntriesTable />
	</div>
	<section class="section odor-wrapper">
		<EmissionForm />
	</section>

	<section class="section location-wrapper">
		<MapView />
	</section>
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
			"entries entries"
			"odor    map";
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
