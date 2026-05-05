<script>
	import data from "$lib/data.json" with { type: "json" };
	import FormWizard from "$lib/FormWizard.svelte";

	//
	// Location Submission
	//
	// GCS Coordinates, default to MSU Geography building
	let locationCoordinates = $state({
		latitude: -84.47281270368809,
		longitude: 42.72927458118972,
	});
	let locationHeader = "Location Details";
	let locSteps = $derived([
		{
			key: "latitude",
			label: "Latitude:",
			legend: "Enter Latitude",
			type: "number",
			min: -90,
			step:0.00000000000001,
			placeholder: "0",
		},
		{
			key: "longitude",
			label: "Longitude:",
			legend: "Enter Longitude",
			type: "number",
			min: -180,
			step:0.00000000000001,
			placeholder: "0",
		},
	]);

	//
	// Odor Submission
	//
	let formState = $state({
		species: "",
		animalType: "",
		housingType: "",
		technology: "",
		area: "",
	});

	let animalTypes = $derived(
		formState.species
			? Object.keys(data.SPECIES[formState.species]?.animalTypes || {})
			: [],
	);

	let housingTypes = $derived(
		formState.animalType && formState.species
			? Object.keys(
					data.SPECIES[formState.species]?.animalTypes[formState.animalType]
						?.housingType || {},
				)
			: [],
	);

	let technologies = $derived(Object.keys(data.TECH || {}));

	let steps = $derived([
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
			disabled: (formState) => !formState.species,
			condition: (formState) => formState.species !== "",
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
			disabled: (formState) => !formState.animalType,
			condition: (formState) => formState.animalType !== "",
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
			condition: (formState) => formState.housingType !== "",
		},
		{
			key: "area",
			label: "Area (sq. ft.):",
			legend: "Enter Area",
			type: "number",
			min: 0,
			step: 0.01,
			placeholder: "0",
		},
	]);

	// Reset animalType when species changes
	$effect(() => {
		if (!animalTypes.includes(formState.animalType)) {
			formState.animalType = "";
		}
	});

	// Reset housingType when animalType changes
	$effect(() => {
		if (!housingTypes.includes(formState.housingType)) {
			formState.housingType = "";
		}
	});
</script>

<FormWizard
	formHeader={locationHeader}
	formDescription="Enter Your GCS Coordinates"
	steps={locSteps}
	bind:formState={locationCoordinates}
/>
<FormWizard {steps} bind:formState />
