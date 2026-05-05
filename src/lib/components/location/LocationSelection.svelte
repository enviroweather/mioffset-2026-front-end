<script>
	import ManualCoords from "$lib/components/location/ManualCoords.svelte";
	import Address from "$lib/components/location/AddressSearch.svelte";
	import CollapsibleButton from "$lib/components/common/CollapsibleButton.svelte";

	import { appState } from "$lib/stores/appState.svelte.js";

	let mode = $state("address");
</script>

<div class="form-wrapper">
	<CollapsibleButton title="Choose Location">
		<div class="toggle">
			<button
				class:active={appState.location.mode === "address"}
				onclick={() => (appState.location.mode = "address")}
			>
				Address
			</button>
			<button
				class:active={appState.location.mode === "manual"}
				onclick={() => (appState.location.mode = "manual")}
			>
				Manual
			</button>
		</div>

		{#if appState.location.mode === "manual"}
			<ManualCoords bind:locationCoordinates={appState.location} />
		{:else if appState.location.mode === "address"}
			<Address></Address>
		{/if}
	</CollapsibleButton>
</div>

<style>
	.form-wrapper {
		background: white;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.toggle {
		display: flex;
		flex: 1;
		margin-left: auto;
		justify-content: flex-end;
	}

	button {
		padding: 0.1rem 1rem;
		border: 1px solid var(--color-kelly-green);
		background: white;
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.3s ease;
	}

	button:first-child {
		border-radius: 4px 0 0 4px;
	}

	button:last-child {
		border-radius: 0 4px 4px 0;
		border-left: none;
	}

	button.active {
		background: var(--color-kelly-green);
		color: white;
	}

	button:hover,
	button:focus {
		border-color: var(--color-spartan-green);
	}
</style>
