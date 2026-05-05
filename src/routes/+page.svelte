<script>
	import LocationSection from "$lib/LocationSelection.svelte";
	import OdorSection from "$lib/OdorSelection.svelte";

	let locationCoordinates = $state({
		latitude: 42.72927458118972,
		longitude: -84.47281270368809,
	});

	let odorFormState = $state({
		species: "",
		animalType: "",
		housingType: "",
		technology: "",
		area: "",
	});
</script>

<div class="page-container">
	<!-- Location Section -->
	<section class="section location-wrapper">
		<LocationSection bind:locationCoordinates />
	</section>

	<!-- Odor Section -->
	<section class="section odor-wrapper">
		<OdorSection bind:odorFormState />
	</section>
</div>

<style>
	.page-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0rem;
		padding: 0rem 0;
	}

	.section {
		display: flex;
		flex-direction: column;
		padding: 1rem
	}

	.location-wrapper {
		grid-column: 1;
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
