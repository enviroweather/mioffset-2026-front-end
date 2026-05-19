<script>
	// --- Imports ---
	import data from "$lib/data/animalData.json" with { type: "json" };
	import {
		appState,
		entries,
		resetFormState,
	} from "$lib/stores/appState.svelte.js";
	import { CalculateOdorControlFactor } from "$lib/utils/OdorEmissionFactor.js";
	import FormWizard from "../common/FormWizard.svelte";

	// --- Dropdown Options ---
	let animalTypeOptions = $derived(
		appState.emission.species
			? Object.keys(data.SPECIES[appState.emission.species]?.animalTypes || {})
			: [],
	);
	let housingTypeOptions = $derived(
		appState.emission.animalType && appState.emission.species
			? Object.keys(
					data.SPECIES[appState.emission.species]?.animalTypes[
						appState.emission.animalType
					]?.housingType || {},
				)
			: [],
	);
	let technologies = $derived(Object.keys(data.TECH || {}));

	// --- Emission Calculations ---
	let oenRate = $derived(
		appState.emission.species &&
			appState.emission.animalType &&
			appState.emission.housingType
			? (data.SPECIES[appState.emission.species]?.animalTypes[
					appState.emission.animalType
				]?.housingType[appState.emission.housingType]?.oen_rate ?? null)
			: null,
	);

	let odorControlFactor = $derived(
		appState.emission.technology
			? data.TECH[appState.emission.technology].odorControlFactor
			: null,
	);

	let totalEmission = $derived(
		CalculateOdorControlFactor(
			oenRate,
			odorControlFactor,
			appState.emission.area,
		),
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
		resetFormState();
	}

	// --- Effects ---
	function resetIfInvalid(options, key) {
		if (!options.includes(appState.emission[key])) appState.emission[key] = "";
	}

	// when species/animalType changes, the previously selected child value may no longer be valid
	$effect(() => resetIfInvalid(animalTypeOptions, "animalType"));
	$effect(() => resetIfInvalid(housingTypeOptions, "housingType"));

	// keep appState in sync so handleOdorSubmit captures the computed values at submit time
	$effect(() => {
		appState.emission.oenRate = oenRate;
		appState.emission.odorControlFactor = odorControlFactor;
		appState.emission.totalEmission = totalEmission;
	});
</script>

<FormWizard
	steps={odorSteps}
	bind:formState={appState.emission}
	{oenRate}
	{odorControlFactor}
	{totalEmission}
	onSubmit={handleOdorSubmit}
/>
