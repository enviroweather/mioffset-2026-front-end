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
		appState.formDrafts.animal.species
			? Object.keys(data.SPECIES[appState.formDrafts.animal.species]?.animalTypes || {})
			: [],
	);
	let housingTypeOptions = $derived(
		appState.formDrafts.animal.animalType && appState.formDrafts.animal.species
			? Object.keys(
					data.SPECIES[appState.formDrafts.animal.species]?.animalTypes[
						appState.formDrafts.animal.animalType
					]?.housingType || {},
				)
			: [],
	);
	let technologies = $derived(Object.keys(data.TECH || {}));

	// --- Emission Calculations ---
	let oenRate = $derived(
		appState.formDrafts.animal.species &&
			appState.formDrafts.animal.animalType &&
			appState.formDrafts.animal.housingType
			? (data.SPECIES[appState.formDrafts.animal.species]?.animalTypes[
					appState.formDrafts.animal.animalType
				]?.housingType[appState.formDrafts.animal.housingType]?.oen_rate ?? null)
			: null,
	);

	let odorControlFactor = $derived(
		appState.formDrafts.animal.technology
			? data.TECH[appState.formDrafts.animal.technology].odorControlFactor
			: null,
	);

	let totalEmission = $derived(
		CalculateOdorControlFactor(
			oenRate,
			odorControlFactor,
			appState.formDrafts.animal.area,
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
			snapshot: {
				location: { ...appState.location },
				formDraft: { ...appState.formDrafts.animal },
				activeForm: appState.activeForm,
			},
		});
		resetFormState();
	}

	// --- Effects ---
	function resetIfInvalid(options, key) {
		if (!options.includes(appState.formDrafts.animal[key])) appState.formDrafts.animal[key] = "";
	}

	// when species/animalType changes, the previously selected child value may no longer be valid
	$effect(() => resetIfInvalid(animalTypeOptions, "animalType"));
	$effect(() => resetIfInvalid(housingTypeOptions, "housingType"));
</script>

<FormWizard
	steps={odorSteps}
	bind:formState={appState.formDrafts.animal}
	{oenRate}
	{odorControlFactor}
	{totalEmission}
	onSubmit={handleOdorSubmit}
/>
