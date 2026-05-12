<script>
	import ManualCoords from "$lib/components/location/ManualCoords.svelte";
	import Address from "$lib/components/location/AddressSearch.svelte";

	import { appState } from "$lib/stores/appState.svelte.js";
	import {
		DEFAULT_LAT,
		DEFAULT_LNG,
	} from "$lib/stores/defaultValues.svelte.js";

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

	async function handleReset(e) {
		// e.preventDefault();
		appState.location.lat = DEFAULT_LAT;
		appState.location.lng = DEFAULT_LNG;
		appState.location.address = "";
	}
</script>

<div class="form-wrapper">
	<div class="form-header">
		<h2>Location Details</h2>
		<p>Enter your farms address</p>
	</div>

	<!-- <CollapsibleButton title="Choose Location"> -->
	<div class="address-wrapper">
		<Address />
		<div class="form-actions">
			<label class="spacer">&nbsp;</label>
			<button type="submit" class="btn btn-primary" onclick={handleSubmit}
				>Search</button
			>
		</div>
	</div>
	<div class="local-footer-wrapper">
		<div class="latlng-wrapper">
			<ManualCoords />
		</div>
		<div class="form-actions">
			<label class="spacer">&nbsp;</label>
			<div class="button-row">
				<button type="reset" class="btn btn-secondary" onclick={handleReset}
					>Clear</button
				>
			</div>
		</div>
	</div>
	<!-- </CollapsibleButton> -->
</div>

<style>
	.form-wrapper {
		background: white;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

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

	.address-wrapper {
		display: flex;
		gap: 1rem;
		flex-direction: row;
	}
	.local-footer-wrapper {
		display: flex;
		padding-top: 1rem;
		gap: 1rem;
	}
	.latlng-wrapper {
		flex: 1;
	}

	.form-actions {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 0.2rem;
	}

	.spacer {
		visibility: hidden;
	}
	.button-row {
		display: flex;
		gap: 1rem;
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
		transform: scaleX(1.03);
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
		transform: scaleX(1.03);
	}

	.btn-secondary:active {
		background-color: #6c7a7b;
	}
</style>
