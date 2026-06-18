<script>
	// --- Imports ---
	import { appState } from "$lib/state/appState.svelte.js";
	import { LATLNG_PRECISION } from "$lib/state/defaultValues.svelte.js";

	function parseCoordInput(value) {
		return value === "" ? null : Number(value);
	}
	// --- State ---
	let latFocused = $state(false);
	let lngFocused = $state(false);

	// --- Display Derived ---
	// show full precision when focused so user can edit exact value; truncate when blurred for readability
	let latDisplay = $derived(
		latFocused
			? (appState.location.lat ?? "")
			: appState.location.lat != null
				? Number(appState.location.lat).toFixed(LATLNG_PRECISION)
				: "",
	);
	let lngDisplay = $derived(
		lngFocused
			? (appState.location.lng ?? "")
			: appState.location.lng != null
				? Number(appState.location.lng).toFixed(LATLNG_PRECISION)
				: "",
	);
</script>

<section class="form-wrapper">
	<form onsubmit={(e) => e.preventDefault()}>
		<div class="coord-row">
			<div class="form-group">
				<label for="latitude">Latitude</label>
				<input
					type="number"
					id="latitude"
					value={latDisplay}
					oninput={(e) => {
						const v = e.currentTarget.value;
						appState.location.lat = parseCoordInput(v);
						appState.location.markerHidden = false;
					}}
					onfocus={() => (latFocused = true)}
					onblur={() => (latFocused = false)}
					min={-90}
					max={90}
					step="any"
					placeholder="e.g. 42.729"
				/>
			</div>

			<div class="form-group">
				<label for="longitude">Longitude</label>
				<input
					type="number"
					id="longitude"
					value={lngDisplay}
					oninput={(e) => {
						const v = e.currentTarget.value;
						appState.location.lng = parseCoordInput(v);
						appState.location.markerHidden = false;
					}}
					onfocus={() => (lngFocused = true)}
					onblur={() => (lngFocused = false)}
					min={-180}
					max={180}
					step="any"
					placeholder="e.g. -84.472"
				/>
			</div>
		</div>
	</form>
</section>

<style>
	/* Layout */
	.form-wrapper {
		width: 100%;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.coord-row {
		display: flex;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 0.2rem;
	}

	label {
		font-weight: 500;
		font-size: 0.9rem;
		color: #333;
	}

	/* Inputs */
	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: inherit;
		width: 100%;
		transition: all 0.3s ease;
	}

	/* Spinner Override */
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type="number"] {
		-webkit-appearance: textfield;
		-moz-appearance: textfield;
		appearance: textfield;
	}

	/* Focus & Hover */
	input:hover {
		border-color: #999;
	}

	input:focus {
		outline: none;
		border-color: #4caf50;
		box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
	}
</style>
