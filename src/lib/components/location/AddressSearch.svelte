<script>
	import { appState } from "$lib/stores/appState.svelte.js";
	import {
		DEFAULT_LAT,
		DEFAULT_LNG,
	} from "$lib/stores/defaultValues.svelte.js";

	let {
		locationCoordinates = $bindable({
			latitude: DEFAULT_LAT,
			longitude: DEFAULT_LNG,
		}),
	} = $props();

	//
	// Address Search Handler
	//
	let query = $state("");
	let suggestions = $state([]);

	async function search() {
		if (query.length < 3) return [];
		const res = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(appState.location.address)}&format=json&limit=5`,
			{ headers: { "User-Agent": "Enviroweather/1.0" } },
		);
		const data = await res.json();
		suggestions = data;
		return data;
	}

	async function handleSubmit(e) {
		e.preventDefault();
		const results = await search();
		console.log(results);
		if (results.length > 0) {
			locationCoordinates.latitude = parseFloat(results[0].lat);
			locationCoordinates.longitude = parseFloat(results[0].lon);
			console.log("Coords:", locationCoordinates);
		}
	}

	function handleReset() {
		appState.location.address = "";
		appState.location.lat = DEFAULT_LAT;
		appState.location.lng = DEFAULT_LNG;
	}

	$effect(() => {
		console.log(suggestions);
	});
</script>

<section class="form-wrapper">
	<div class="form-header">
		<h2>Coordinate Details</h2>
		<p>Enter your farms address</p>
	</div>

	<form onsubmit={handleSubmit} onreset={handleReset}>
		<div class="form-group">
			<label for="address">Address</label>
			<input
				id="address"
				name="address"
				list="suggestions"
				bind:value={appState.location.address}
			/>
		</div>

		<div class="form-actions">
			<button type="submit" class="btn btn-primary">Update Location</button>
			<button type="reset" class="btn btn-secondary">Reset</button>
		</div>
	</form>
</section>

<style>
	.form-header {
		margin-bottom: 2rem;
		border-bottom: 2px solid #4caf50;
		padding-bottom: 1rem;
	}

	.form-header h2 {
		margin: 0 0 0.5rem 0;
		color: #2c3e50;
		font-size: 1.5rem;
	}

	.form-header p {
		margin: 0;
		color: #666;
		font-size: 0.95rem;
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
		flex-direction: column;
		gap: 0.2rem;
		flex: 1;
	}

	label {
		font-weight: 500;
		color: #333;
		font-size: 1rem;
	}

	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
		transition: all 0.3s ease;
	}

	/* Hides the input arrows (found here https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp) */
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type="number"] {
		-moz-appearance: textfield;
	}

	input:hover {
		border-color: #999;
	}

	input:focus {
		outline: none;
		border-color: #4caf50;
		box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.5rem;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.btn-primary {
		background-color: var(--color-kelly-green);
		color: white;
	}

	.btn-primary:hover {
		background-color: #008934;
		box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
	}

	.btn-primary:active {
		background-color: #008934;
		transform: translateY(1px);
	}

	.btn-secondary {
		background-color: #95a5a6;
		color: white;
	}

	.btn-secondary:hover {
		background-color: #7f8c8d;
	}

	.btn-secondary:active {
		background-color: #6c7a7b;
	}

	@media (max-width: 640px) {
		.form-wrapper {
			padding: 1.5rem 1rem;
		}

		.form-header h2 {
			font-size: 1.25rem;
		}

		.coord-row {
			flex-direction: column;
		}

		.form-actions {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}
	}
</style>
