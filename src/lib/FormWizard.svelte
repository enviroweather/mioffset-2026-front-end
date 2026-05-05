<script>
	let { steps, formState = $bindable() } = $props();

	function handleSubmit(e) {
		e.preventDefault();
		alert(JSON.stringify(formState, null, 2));
	}

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
	<form onsubmit={handleSubmit} onreset={handleReset}>
		{#each steps as step, index}
			{#if !step.condition || step.condition(formState)}
				<fieldset>
					<legend
						>Step {index + 1}: {step.legend ||
							step.label.replace(":", "")}</legend
					>

					<div class="form-group">
						<label for={step.key}>{step.label}</label>
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
										"Select " +
											step.label.toLowerCase().replace(":", "")}</option
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
			{/if}
		{/each}
      
		<!-- Form Actions -->
		<div class="form-actions">
			<button type="submit" class="btn btn-primary">Submit Form</button>
			<button type="reset" class="btn btn-secondary">Clear Form</button>
		</div>
	</form>
</section>

<style>
	

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	fieldset {
		border: 1px solid #ddd;
		border-radius: 6px;
		padding: 1rem;
		margin: 0;
	}

	legend {
		padding: 0 0.5rem;
		font-weight: 600;
		color: #2c3e50;
		font-size: 0.90rem;
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
