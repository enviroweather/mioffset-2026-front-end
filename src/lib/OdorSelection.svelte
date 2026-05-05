<script>
	import data from "$lib/data.json" with { type: "json" };
	import FormWizard from "./FormWizard.svelte";

	let {
		odorFormState = $bindable({
			species: "",
			animalType: "",
			housingType: "",
			technology: "",
			area: "",
		}),
	} = $props();

	let animalTypes = $derived(
		odorFormState.species
			? Object.keys(data.SPECIES[odorFormState.species]?.animalTypes || {})
			: [],
	);

	let housingTypes = $derived(
		odorFormState.animalType && odorFormState.species
			? Object.keys(
					data.SPECIES[odorFormState.species]?.animalTypes[
						odorFormState.animalType
					]?.housingType || {},
				)
			: [],
	);

	let technologies = $derived(Object.keys(data.TECH || {}));

	const odorSteps = $derived([
		{
			key: "species",
			label: "Species:",
			legend: "Select Species",
			type: "select",
			options: Object.keys(data.SPECIES).map((spec) => ({
				value: spec,
				text: data.SPECIES[spec].display,
			})),
			required: true,
		},
		{
			key: "animalType",
			label: "Animal Type:",
			legend: "Select Animal Type",
			type: "select",
			options: animalTypes.map((type) => ({ value: type, text: type })),
			required: true,
			disabled: (state) => !state.species,
			condition: (state) => state.species !== "",
		},
		{
			key: "housingType",
			label: "Housing Type:",
			legend: "Select Housing Type",
			type: "select",
			options: housingTypes.map((housing) => ({
				value: housing,
				text: housing,
			})),
			required: true,
			disabled: (state) => !state.animalType,
			condition: (state) => state.animalType !== "",
		},
		{
			key: "technology",
			label: "Technology Adjustment:",
			legend: "Select Technology Adjustment",
			type: "select",
			options: [
				{ value: "", text: "No Technology Adjustment" },
				...technologies.map((tech) => ({
					value: tech,
					text: data.TECH[tech].display,
				})),
			],
			condition: (state) => state.housingType !== "",
		},
		{
			key: "area",
			label: "Area (sq. ft.):",
			legend: "Enter Area",
			type: "number",
			min: 0,
			step: 0.01,
			placeholder: "0",
			helpText: "Storage area in square feet",
		},
	]);

	function handleOdorSubmit(formData) {
		console.log("Odor form submitted:", formData);
		// TODO: Send to API or process odor emission data
	}

	// Reset dependent fields when parent values change
	$effect(() => {
		if (!animalTypes.includes(odorFormState.animalType)) {
			odorFormState.animalType = "";
		}
	});

	$effect(() => {
		if (!housingTypes.includes(odorFormState.housingType)) {
			odorFormState.housingType = "";
		}
	});
</script>

<section class="odor-section">
	<div class="form-header">
		<h2>Odor Emission Calculator</h2>
		<p>Enter details about animal units and waste storage</p>
	</div>

	<FormWizard
		formHeader="Odor Emission Calculator"
		formDescription="Enter details about animal units and waste storage"
		direction="column"
		steps={odorSteps}
		bind:formState={odorFormState}
		submitLabel="Calculate Odor"
		resetLabel="Clear Form"
		onSubmit={handleOdorSubmit}
	/>
</section>

<style>
	.odor-section {
		background: white;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
</style>
