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
	let suggestions = $state([]);

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			// calls server.js to run query
			const res = await fetch(
				`/api/geocode?query=${encodeURIComponent(appState.location.address)}`,
			);

			if (!res.ok) {
				throw new Error(`API call failed with status ${res.status}`);
			}

			const data = await res.json();
			const results = data.results || [];

			if (results.length > 0) {
				appState.location.lat = parseFloat(results[0].position.lat);
				appState.location.lng = parseFloat(results[0].position.lon);
			}
		} catch (error) {
			console.error("Geocoding error:", error);
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
		<h2>Location Details</h2>
		<p>Enter your farms address</p>
	</div>

	<form onsubmit={handleSubmit} onreset={handleReset}>
		<div class="form-group">
			<label for="address">Address</label>
			<input
				id="address"
				name="address"
				list="suggestions"
				placeholder="673 Auditorium Rd, East Lansing, MI 48824"
				bind:value={appState.location.address}
			/>
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
