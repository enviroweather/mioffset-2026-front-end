<script>
	import storageData from "$lib/data/storageData.json";
	import animalData from "$lib/data/animalData.json";
	import FormWizard from "../common/FormWizard.svelte";

	import {
		appState,
		entries,
		resetFormState,
	} from "$lib/stores/appState.svelte.js";
	import { CalculateOdorControlFactor } from "$lib/utils/OdorEmissionFactor.js";

	let technologies = $derived(Object.keys(animalData.TECH || {}));

	// --- Emission Calculations ---
	let oenRate = $derived(
		appState.emission.storageType
			? (storageData.STORAGE[appState.emission.storageType]?.oen_rate ?? null)
			: null,
	);

	let odorControlFactor = $derived(
		appState.emission.technology
			? animalData.TECH[appState.emission.technology]?.odorControlFactor
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
			legend: "Enter Area",
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
			odor: {
				storageType: formData.storageType,
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
				emission: { ...appState.emission },
				activeForm: appState.activeForm,
			},
		});
		resetFormState();
	}

	// --- Effects ---
	$effect(() => {
		appState.emission.oenRate = oenRate;
		appState.emission.odorControlFactor = odorControlFactor;
		appState.emission.totalEmission = totalEmission;
	});
</script>

<FormWizard
	steps={storageSteps}
	bind:formState={appState.emission}
	{oenRate}
	{odorControlFactor}
	{totalEmission}
	onSubmit={handleStorageSubmit}
/>
