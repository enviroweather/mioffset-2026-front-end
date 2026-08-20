<script>
	import storageData from "$lib/data/storageData.json";
	import animalData from "$lib/data/animalData.json";
	import FormWizard from "../common/FormWizard.svelte";

	// Edits the building in place - no draft, no submit.
	let { building } = $props();

	let technologies = $derived(Object.keys(animalData.TECH || {}));

	// --- Form Step Config ---
	const storageSteps = $derived([
		{
			key: "storageType",
			label: "Storage Type:",
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
			type: "select",
			options: technologies.map((tech) => ({
				value: tech,
				text: animalData.TECH[tech].display,
			})),
			required: false,
		},
		{
			key: "area",
			label: "Area (sq. ft.):",
			type: "number",
			min: 0,
			step: 0.01,
			placeholder: "0",
			helpText: "Surface area of this storage in square feet",
		},
	]);
</script>

<FormWizard steps={storageSteps} bind:formState={building} />
