<script>
	// --- Imports ---
	import {
		appState,
		entries,
		resetFormState,
	} from "$lib/stores/appState.svelte.js";
	import FormWizard from "../common/FormWizard.svelte";

	// --- Form Step Config ---
	const manualSteps = [
		{
			key: "manualEmission",
			label: "Odor Emission Factor:",
			legend: "Enter OEF",
			type: "number",
			min: 0,
			step: 0.01,
			placeholder: "10",
			helpText: "Total Odor Emission Factor (OEF) for This Site",
			required: true,
		},
	];

	// --- Submit Handler ---
	function handleOdorSubmit(formData) {
		entries.push({
			odor: {
				totalEmission: formData.manualEmission,
			},
			location: {
				lat: appState.location.lat,
				lng: appState.location.lng,
				address: appState.location.address,
			},
			snapshot: {
				location: { ...appState.location },
				formDraft: { ...appState.formDrafts.manual },
				activeForm: appState.activeForm,
			},
		});
		resetFormState();
	}
</script>

<FormWizard
	steps={manualSteps}
	bind:formState={appState.formDrafts.manual}
	onSubmit={handleOdorSubmit}
/>
