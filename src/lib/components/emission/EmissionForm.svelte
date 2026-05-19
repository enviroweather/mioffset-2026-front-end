<script>
	import OdorForm from "./OdorForm.svelte";
	import StorageForm from "./StorageForm.svelte";
	import { resetFormState } from "$lib/stores/appState.svelte.js";
	import ManualForm from "./ManualForm.svelte";

	let activeForm = $state("animal");

	const subtitles = {
		animal: "Enter details about animal units and waste storage",
		storage: "Enter details about waste storage",
		manual: "Enter your total Odor Emission Factor for this site",
	};

	function switchForm(form) {
		if (form === activeForm) return;
		resetFormState();
		activeForm = form;
	}
</script>

<div class="emission-form">
	<div class="form-header">
		<div class="header-text">
			<div class="header-wrapper">
				<h2>Odor Emission Calculator</h2>
				<div class="form-tabs">
					<button
						class="tab"
						class:active={activeForm === "animal"}
						onclick={() => switchForm("animal")}
					>
						Animal
					</button>
					<button
						class="tab"
						class:active={activeForm === "storage"}
						onclick={() => switchForm("storage")}
					>
						Storage
					</button>
					<button
						class="tab"
						class:active={activeForm === "manual"}
						onclick={() => switchForm("manual")}
					>
						Manual
					</button>
				</div>
			</div>
			<p>{subtitles[activeForm]}</p>
		</div>
	</div>

	{#if activeForm === "animal"}
		<OdorForm />
	{/if}
	{#if activeForm === "storage"}
		<StorageForm />
	{/if}
	{#if activeForm === "manual"}
		<ManualForm />
	{/if}
</div>

<style>
	.emission-form {
		background: white;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.form-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 2rem;
		border-bottom: 2px solid #4caf50;
		padding-bottom: 1rem;
	}

	.header-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
	}
	.header-text {
		flex: 1;
	}
	.header-text h2 {
		margin: 0 0 0.5rem 0;
		color: #2c3e50;
		font-size: 1.5rem;
	}

	.header-text p {
		margin: 0;
		color: #666;
		font-size: 0.95rem;
	}

	.form-tabs {
		display: flex;
		color: black;
		gap: 0.5rem;
		align-self: center;
	}

	.tab {
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		font-size: 0.95rem;
		color: inherit;
		transition:
			color 0.15s,
			border-color 0.15s;
	}

	.tab:hover,
	.tab.active {
		color: #4caf50;
		border-bottom-color: #4caf50;
	}
</style>
