<script>
	import FormWizard from "../common/FormWizard.svelte";

	// Edits the building in place - no draft, no submit.
	let { building } = $props();

	// --- Form Step Config ---
	const manualSteps = [
		{
			key: "manualEmission",
			label: "Odor Emission Factor:",
			type: "number",
			min: 0,
			step: 1,
			placeholder: "10",
			helpText:
				"Odor Emission Factor for this structure. It is used directly, and also weights the structure's pull on the site centroid.",
			required: true,
		},
	];
</script>

<FormWizard steps={manualSteps} bind:formState={building} />
