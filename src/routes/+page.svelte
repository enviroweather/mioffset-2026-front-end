<script>
	import LocationSection from "$lib/components/location/LocationSelection.svelte";
	import MapView from "$lib/components/location/MapView.svelte";
	import OdorForm from "$lib/components/odor/OdorForm.svelte";
	import { appState } from "$lib/stores/appState.svelte.js";
	import { DEFAULT_LAT, DEFAULT_LNG } from "$lib/stores/defaultValues.svelte.js";
	let locationCoordinates = $state({
		latitude: DEFAULT_LAT,
		longitude: DEFAULT_LNG,
	});
</script>

<div class="page-container">
	<!-- Location Section -->

	<section class="section location-wrapper">
		<!-- <LocationSection bind:form={appState.location} /> -->
		<MapView/>
	</section>

	<!-- Odor Section -->
	<section class="section odor-wrapper">
		<OdorForm />
	</section>

</div>

<style>
	.page-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
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
	.form-header {
		margin-bottom: 2rem;
		border-bottom: 2px solid #4caf50;
		padding-bottom: 1rem;
	}

	.form-header h2 {
		margin: 0 0 0.5rem 0;
		color: #2c3e50;
		font-size: 1.5rem;
	}

	.form-header p {
		margin: 0;
		color: #666;
		font-size: 0.95rem;
	}
	.location-wrapper {
		grid-column: 1;
		gap: 1rem;
	}

	.odor-wrapper {
		grid-column: 2;
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
