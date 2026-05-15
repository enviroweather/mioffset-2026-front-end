<script>
	import { slide } from "svelte/transition";

	// --- Props & State ---
	let { children } = $props();
	let open = $state(true);
</script>

<div class="box">
	<button class="btn" onclick={() => (open = !open)}>{open ? "-" : "+"}</button>
	{#if open}
		<div class="content" transition:slide>
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.box {
		border: 1px solid #ccc;
		border-radius: 4px;
		overflow: hidden;
		cursor: auto;
	}

	.btn {
		border: none;
		background: none;
		font-size: 1rem;
		padding: 0.1rem 0.4rem;
		font-family: inherit;
		color: var(--color-spartan-green);
		cursor: pointer;
		line-height: 1;
	}

	.content {
		padding: 1rem;
		border-top: 1px solid #ccc;
	}
</style>
