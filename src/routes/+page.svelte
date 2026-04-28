<script>
	import data from "$lib/data.json" with { type: "json" };

	let formState = $state({
		species: "",
		animalType: "",
		housingType: "",
		technology: "",
		area: "",
	});

	let animalTypes = $derived(
		formState.species
			? Object.keys(data.SPECIES[formState.species]?.animalTypes || {})
			: [],
	);

	let housingTypes = $derived(
		formState.animalType && formState.species
			? Object.keys(
					data.SPECIES[formState.species]?.animalTypes[formState.animalType]
						?.housingType || {},
				)
			: [],
	);

	let technologies = $derived(Object.keys(data.TECH || {}));

	// Reset animalType when species changes
	$effect(() => {
		if (!animalTypes.includes(formState.animalType)) {
			formState.animalType = "";
		}
	});

	// Reset housingType when animalType changes
	$effect(() => {
		if (!housingTypes.includes(formState.housingType)) {
			formState.housingType = "";
		}
	});

	function handleSubmit(e) {
		e.preventDefault();
		alert(JSON.stringify(formState, null, 2));
	}

	function handleReset() {
		formState = {
			species: "",
			animalType: "",
			housingType: "",
			technology: "",
			area: "",
		};
	}
</script>

<section class="form-wrapper">
	<div class="form-header">
		<h2>Odor Emission Calculator</h2>
		<p>Enter details about animal units and waste storage</p>
	</div>

	<form onsubmit={handleSubmit} onreset={handleReset}>
		<!-- Species Selection -->
		<fieldset>
			<legend>Step 1: Select Species</legend>
			<div class="form-group">
				<label for="species">Species:</label>
				<select
					id="species"
					bind:value={formState.species}
					required
					aria-label="Select species"
				>
					<option value="">Select species</option>
					{#each Object.keys(data.SPECIES) as spec}
						<option value={spec}>{data.SPECIES[spec].display}</option>
					{/each}
				</select>
			</div>
		</fieldset>

		<!-- Animal Type Selection -->
		<!-- {#if formState.species != ""} -->
		<fieldset>
			<legend>Step 2: Select Animal Type</legend>
			<div class="form-group">
				<label for="animalType">Animal Type:</label>
				<select
					id="animalType"
					bind:value={formState.animalType}
					disabled={!formState.species}
					required
					aria-label="Select animal type"
				>
					<option value="">Select animal type</option>
					{#each animalTypes as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
			</div>
		</fieldset>
		<!-- {/if} -->

		<!-- Housing Type Selection -->
		<fieldset>
			<legend>Step 3: Select Housing Type</legend>
			<div class="form-group">
				<label for="housingType">Housing Type:</label>
				<select
					id="housingType"
					bind:value={formState.housingType}
					disabled={!formState.animalType}
					required
					aria-label="Select housing type"
				>
					<option value="">Select housing type</option>
					{#each housingTypes as housing}
						<option value={housing}>{housing}</option>
					{/each}
				</select>
			</div>
		</fieldset>

		<!-- Technology Selection -->
		<fieldset>
			<legend>Step 4: Select Technology Adjustment</legend>
			<div class="form-group">
				<label for="technology">Technology Adjustment:</label>
				<select
					id="technology"
					bind:value={formState.technology}
					aria-label="Select technology adjustment"
				>
					<option value="">No Technology Adjustment</option>
					{#each technologies as tech}
						<option value={tech}>{data.TECH[tech].display}</option>
					{/each}
				</select>
			</div>
		</fieldset>

		<!-- Area Input -->
		<fieldset>
			<legend>Step 5: Enter Area</legend>
			<div class="form-group">
				<label for="area">Area (sq. ft.):</label>
				<input
					type="number"
					id="area"
					bind:value={formState.area}
					placeholder="0"
					min="0"
					step="0.01"
					aria-label="Enter area in square feet"
				/>
			</div>
		</fieldset>

		<!-- Form Actions -->
		<div class="form-actions">
			<button type="submit" class="btn btn-primary">Get Results</button>
			<button type="reset" class="btn btn-secondary">Clear Form</button>
		</div>
	</form>
</section>

<style>
	.form-wrapper {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		max-width: 600px;
		margin: 0 auto;
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

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	fieldset {
		border: 1px solid #ddd;
		border-radius: 6px;
		padding: 1.25rem;
		margin: 0;
	}

	legend {
		padding: 0 0.5rem;
		font-weight: 600;
		color: #2c3e50;
		font-size: 0.95rem;
	}

	.form-group {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 500;
		color: #333;
		font-size: 0.95rem;
	}

	select,
	input {
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
		transition: all 0.3s ease;
	}

	select:hover,
	input:hover {
		border-color: #999;
	}

	select:focus,
	input:focus {
		outline: none;
		border-color: #4caf50;
		box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
	}

	select:disabled {
		background-color: #f0f0f0;
		color: #999;
		cursor: not-allowed;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.75rem 1.5rem;
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

	.btn-primary:hover:not(:disabled) {
		background-color: #008934;
		box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
	}

	.btn-primary:active:not(:disabled) {
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

		.form-actions {
			flex-direction: column;
			justify-content: stretch;
		}

		.btn {
			width: 100%;
		}

		fieldset {
			padding: 1rem;
		}
	}
</style>
