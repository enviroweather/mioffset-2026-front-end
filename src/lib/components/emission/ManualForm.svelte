<script>
	// --- Imports ---
	import {
		appState,
		entries,
		resetAppState,
	} from "$lib/stores/appState.svelte.js";
	import FormWizard from "../common/FormWizard.svelte";
	// --- Form Step Config ---
	const manualSteps = $derived([
		{
			key: "totalEmission",
			label: "Odor Emission Factor:",
			legend: "Enter OEF",
			type: "number",
			min: 0,
			step: 0.01,
			placeholder: "10",
			helpText: "Total Odor Emission Factor (OEF) for This Site",
			required: true,
		},
	]);

	// --- Emission Binding ---
	let totalEmission = $derived(appState.emission.totalEmission);

	// --- Submit Handler ---
	function handleOdorSubmit(formData) {
		entries.push({
			odor: {
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

	// keep appState in sync so handleOdorSubmit captures the computed values at submit time
	$effect(() => {
		appState.emission.totalEmission = totalEmission;
		console.log("total emission updated")
	});
</script>

<FormWizard
	steps={manualSteps}
	bind:formState={appState.emission}
  {totalEmission}
	onSubmit={handleOdorSubmit}
/>
