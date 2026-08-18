<script>
	let { value = $bindable(), placeholder, id, ariaLabel } = $props();

	// Owned display string - Svelte never writes here except on external reset.
	let display = $state(value != null ? value.toLocaleString("en-US") : "");

	function handleInput(e) {
		const raw = e.currentTarget.value.replace(/,/g, "");
		const num = parseFloat(raw);
		value = isNaN(num) ? undefined : num;
		// Do NOT touch `display` - let the user keep typing freely.
	}

	function handleBlur() {
		// Format with commas once the user leaves the field.
		display = value != null ? value.toLocaleString("en-US") : "";
	}

	// Only sync display from outside when the field is cleared (e.g. form reset).
	$effect(() => {
		if (value == null || value === "") display = "";
	});
</script>

<input
	type="text"
	inputmode="numeric"
	{id}
	bind:value={display}
	oninput={handleInput}
	onblur={handleBlur}
	{placeholder}
	aria-label={ariaLabel}
/>

<style>
	input {
		padding: 0.55rem 0.65rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
		transition: all 0.3s ease;
		width: 100%;
	}

	input:hover {
		border-color: #999;
	}

	input:focus {
		outline: none;
		border-color: #4caf50;
		box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
	}
</style>
