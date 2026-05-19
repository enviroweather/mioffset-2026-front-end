<script>
	// --- Imports ---
	import data from "$lib/data.json" with { type: "json" };
	import { appState, entries, resetAppState } from "$lib/stores/appState.svelte.js";
	import FormWizard from "../common/FormWizard.svelte";

	// --- Dropdown Options ---
	let animalTypeOptions = $derived(
		appState.odor.species
			? Object.keys(data.SPECIES[appState.odor.species]?.animalTypes || {})
			: [],
	);
	let housingTypeOptions = $derived(
		appState.odor.animalType && appState.odor.species
			? Object.keys(
					data.SPECIES[appState.odor.species]?.animalTypes[
						appState.odor.animalType
					]?.housingType || {},
				)
			: [],
	);
	let technologies = $derived(Object.keys(data.TECH || {}));

	// --- Emission Calculations ---
	let oenRate = $derived(
		appState.odor.species &&
			appState.odor.animalType &&
			appState.odor.housingType
			? (data.SPECIES[appState.odor.species]?.animalTypes[
					appState.odor.animalType
				]?.housingType[appState.odor.housingType]?.oen_rate ?? null)
			: null,
	);

	let odorControlFactor = $derived(
		appState.odor.technology
			? data.TECH[appState.odor.technology].odorControlFactor
			: null,
	);

	// E = (oenRate × odorControlFactor × area) / 10000
	// Equation taken from legacy code
	// area in sq ft, odorControlFactor is transmission fraction (1.0 for no technology)
	let totalEmission = $derived(
		oenRate != null && odorControlFactor != null && appState.odor.area != null && appState.odor.area !== ''
			? (oenRate * odorControlFactor * Number(appState.odor.area)) / 10000
			: null,
	);
	// --- Form Step Config ---
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
			options: animalTypeOptions.map((type) => ({ value: type, text: type })),
			required: true,
			disabled: (state) => !state.species,
			condition: (state) => state.species !== "",
		},
		{
			key: "housingType",
			label: "Housing Type:",
			legend: "Select Housing Type",
			type: "select",
			options: housingTypeOptions.map((housing) => ({
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
				...technologies.map((tech) => ({
					value: tech,
					text: data.TECH[tech].display,
				})),
			],
			required: true,
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

	// --- Submit Handler ---
	function handleOdorSubmit(formData) {
		entries.push({
			odor: {
				species: formData.species,
				animalType: formData.animalType,
				housingType: formData.housingType,
				technology: formData.technology,
				area: formData.area,
				oenRate: oenRate,
				odorControlFactor: odorControlFactor,
				totalEmission: totalEmission,
			},
			location: {
				lat: appState.location.lat,
				lng: appState.location.lng,
				address: appState.location.address,
			},
		});
		resetAppState();
	}

	// --- Effects ---
	function resetIfInvalid(options, key) {
		if (!options.includes(appState.odor[key])) appState.odor[key] = "";
	}

	// when species/animalType changes, the previously selected child value may no longer be valid
	$effect(() => resetIfInvalid(animalTypeOptions, "animalType"));
	$effect(() => resetIfInvalid(housingTypeOptions, "housingType"));

	// keep appState in sync so handleOdorSubmit captures the computed values at submit time
	$effect(() => {
		appState.odor.oenRate = oenRate;
		appState.odor.odorControlFactor = odorControlFactor;
		appState.odor.totalEmission = totalEmission;
	});
</script>

<section class="odor-section">
	<div class="form-header">
		<h2>Odor Emission Calculator</h2>
		<p>Enter details about animal units and waste storage</p>
	</div>
	<FormWizard
		steps={odorSteps}
		bind:formState={appState.odor}
		{oenRate}
		{odorControlFactor}
		{totalEmission}
		onSubmit={handleOdorSubmit}
	/>
</section>

<style>
	/* Section Wrapper */
	.odor-section {
		background: white;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	/* Form Header */
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
