<script>
	// --- Imports ---
	import MapView from "$lib/components/location/MapView.svelte";
	import OdorForm from "$lib/components/odor/OdorForm.svelte";
	import EntriesTable from "$lib/components/entries/EntriesTable.svelte";
</script>

<!-- Odor & Map -->
<div class="page-container">
	<section class="section odor-wrapper">
		<OdorForm />
	</section>
	<section class="section location-wrapper">
		<MapView />
	</section>
</div>

<!-- Entries -->
<div class="entries-container">
	<EntriesTable />
</div>

<style>
	/* Grid Layout */
	.page-container {
		display: grid;
		grid-template-columns: 1fr 2fr;
	}
	.section {
		display: flex;
		flex-direction: column;
		padding: 1rem;
	}

	/* Section Wrappers */
	.odor-wrapper {
		border-radius: 8px;
		padding: 1rem;
	}
	.location-wrapper {
		gap: 1rem;
	}

	.entries-container {
		padding: 0 1rem 1rem;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.page-container {
			grid-template-columns: 1fr;
		}

		.location-wrapper {
			grid-column: 1;
		}

		.odor-wrapper {
			grid-column: 1;
		}
	}
</style>
