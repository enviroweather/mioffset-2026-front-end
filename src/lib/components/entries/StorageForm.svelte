<script>
	import storageData from "$lib/data/storageData.json";
	import animalData from "$lib/data/animalData.json";
	import FormWizard from "../common/FormWizard.svelte";

	import {
		appState,
		entries,
		resetFormState,
	} from "$lib/state/appState.svelte.js";
	import { CalculateTotalEmission } from "$lib/utils/model/OdorEmissionFactor.js";

	let technologies = $derived(Object.keys(animalData.TECH || {}));

	// --- Emission Calculations ---
	let oenRate = $derived(
		appState.formDrafts.storage.storageType
			? (storageData.STORAGE[appState.formDrafts.storage.storageType]
					?.oen_rate ?? null)
			: null,
	);

	let odorControlFactor = $derived(
		appState.formDrafts.storage.technology
			? animalData.TECH[appState.formDrafts.storage.technology]
					?.odorControlFactor
			: null,
	);

	let totalEmission = $derived(
		CalculateTotalEmission(
			oenRate,
			odorControlFactor,
			appState.formDrafts.storage.area,
		),
	);

	// --- Form Step Config ---
	const storageSteps = $derived([
		{
			key: "storageType",
			label: "Storage Type:",
			legend: "Select Storage Type",
			type: "select",
			options: Object.keys(storageData.STORAGE).map((s) => ({
				value: s,
				text: storageData.STORAGE[s].display,
			})),
			required: true,
		},
		{
			key: "technology",
			label: "Technology Adjustment:",
			legend: "Select Technology Adjustment",
			type: "select",
			options: technologies.map((tech) => ({
				value: tech,
				text: animalData.TECH[tech].display,
			})),
			required: false,
			condition: (state) => state.storageType !== "",
		},
		{
			key: "area",
			label: "Area (sq. ft.):",
			legend: "Enter Area (no commas)",
			type: "number",
			min: 0,
			step: 0.01,
			placeholder: "0",
			helpText: "Storage area in square feet",
		},
	]);

	// --- Submit Handler ---
	function handleStorageSubmit(formData) {
		entries.push({
			formType: "storage",
			storageType: formData.storageType,
			technology: formData.technology,
			area: formData.area,
			oenRate: oenRate,
			odorControlFactor: odorControlFactor,
			totalEmission: totalEmission,
			location: {
				lat: appState.location.lat,
				lng: appState.location.lng,
				address: appState.location.address,
			},
			snapshot: {
				location: { ...appState.location },
				formDraft: { ...appState.formDrafts.storage },
				activeForm: appState.activeForm,
			},
		});
		resetFormState();
	}
</script>

<FormWizard
	steps={storageSteps}
	bind:formState={appState.formDrafts.storage}
	{oenRate}
	{odorControlFactor}
	{totalEmission}
	onSubmit={handleStorageSubmit}
/>
