<script>
	// --- Props ---
	let {
		steps,
		formState = $bindable(),
		oenRate = null,
		odorControlFactor = null,
		totalEmission = null,
		onSubmit = () => {},
	} = $props();

	// --- Derived ---
	let canSubmit = $derived(
		steps.every(
			(step) =>
				!step.required ||
				(formState[step.key] !== "" && formState[step.key] != null),
		),
	);

	function handleReset() {
		for (let step of steps) {
			if (step.type === "select") {
				formState[step.key] = "";
			} else if (step.type === "number") {
				formState[step.key] = undefined;
			}
		}
	}
</script>

<section>
	<form
		onsubmit={(e) => {
			e.preventDefault();
			onSubmit(formState);
		}}
		onreset={handleReset}
	>
		<!-- Display Form Steps -->
		{#each steps as step, index}
			<fieldset>
				<legend
					>Step {index + 1}: {step.legend ||
						step.label.replace(":", "")}</legend
				>

				<div class="form-group">
					{#if step.type === "select"}
						<select
							id={step.key}
							bind:value={formState[step.key]}
							disabled={step.disabled ? step.disabled(formState) : false}
							required={step.required}
							aria-label={step.label}
						>
							<option value=""
								>{step.placeholder ||
									"Select " + step.label.toLowerCase().replace(":", "")}</option
							>
							{#each step.options as option}
								<option value={option.value}>{option.text}</option>
							{/each}
						</select>
					{:else if step.type === "number"}
						<input
							type="number"
							id={step.key}
							bind:value={formState[step.key]}
							placeholder={step.placeholder}
							min={step.min}
							max={step.max}
							step={step.step}
							aria-label={step.label}
						/>
					{/if}
				</div>
			</fieldset>
		{/each}

		<!-- Calculated Results -->
		<div class="form-actions">
			<div class="calculated-numbers">
				<div class="Odor Emission Number">
					{#if oenRate !== null && oenRate !== undefined}
						<span class="rate-label">Odor Emission Rate:</span>
						<span class="rate-value">{oenRate}</span>
					{/if}
				</div>
				<div class="Odor Control Factor">
					{#if odorControlFactor !== null && odorControlFactor !== undefined}
						<span class="rate-label">Odor Control Factor:</span>
						<span class="rate-value">{odorControlFactor}</span>
					{/if}
				</div>
			</div>
			<!-- Form Actions -->
			<div class="form-buttons">
				<button type="submit" class="btn btn-primary" disabled={!canSubmit}
					>Update Site</button
				>
				<button type="reset" class="btn btn-secondary">Clear Form</button>
			</div>
		</div>
	</form>
</section>

<style>
	/* Fieldset & Labels */
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	fieldset {
		border: 1px solid #ddd;
		border-radius: 6px;
		padding: 0.5rem;
		margin: 0;
	}

	legend {
		padding: 0 0.5rem;
		font-weight: 600;
		color: #2c3e50;
		font-size: 0.9rem;
	}

	.form-group {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	label {
		font-weight: 500;
		color: #333;
		font-size: 0.95rem;
	}

	/* Inputs */
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

	/* Form Actions */
	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		align-items: center;
	}

	.form-buttons {
		display: flex;
		gap: 1rem;
	}

	.rate-label {
		font-weight: 500;
		color: #555;
	}

	.rate-value {
		font-weight: 700;
		color: var(--color-kelly-green, #2c3e50);
	}

	/* Buttons */
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

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.btn-primary:hover:not(:disabled) {
		background-color: #008934;
		box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
		transform: scaleX(1.03);
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
		transform: scaleX(1.03);
	}

	.btn-secondary:active {
		background-color: #6c7a7b;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.form-actions {
			flex-direction: column;
			justify-content: stretch;
			align-items: stretch;
		}

		.form-buttons {
			flex-direction: column;
			width: 100%;
		}

		.btn {
			width: 100%;
		}

		fieldset {
			padding: 1rem;
		}
	}
</style>
