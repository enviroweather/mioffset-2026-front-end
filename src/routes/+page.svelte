<script>
	import LocationSection from "$lib/components/location/LocationSelection.svelte";
	import MapView from "$lib/components/location/MapView.svelte";
	import OdorForm from "$lib/components/odor/OdorForm.svelte";
	import { appState } from "$lib/stores/appState.svelte.js";
	import {
		DEFAULT_LAT,
		DEFAULT_LNG,
	} from "$lib/stores/defaultValues.svelte.js";
	let locationCoordinates = $state({
		latitude: DEFAULT_LAT,
		longitude: DEFAULT_LNG,
	});
</script>

<div class="page-container">
	<!-- Odor Section -->

	<section class="section odor-wrapper">
		<OdorForm />
	</section>
	<section class="section location-wrapper">
		<MapView />
	</section>
</div>

<style>
	.page-container {
		display: grid;
		grid-template-columns: 1fr 2fr;
	}
	.section {
		display: flex;
		flex-direction: column;
		padding: 1rem;
	}

	.odor-wrapper {
		border-radius: 8px;
		padding: 1rem;
	}
	.location-wrapper {
		gap: 1rem;
	}

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
