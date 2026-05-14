<script>
	// --- Props & State ---
	import { slide } from "svelte/transition";
	let { title, children } = $props();
	let open = $state(true);
</script>

<div class="collapsible">
	<button class="btn header" onclick={() => (open = !open)}>
		<span>{title}</span>
		<span>{open ? "▲" : "▼"}</span>
	</button>

	{#if open}
		<div class="content" transition:slide>
			{@render children()}
		</div>
	{/if}
</div>

<style>
	/* Toggle Button */
	.collapsible {
		border-radius: 4px;
		overflow: hidden;
	}

	.header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	/* Content Panel */
	.content {
		padding: 1rem;
		border: 1px solid #ccc;
		border-top: none;
		border-radius: 0 0 4px 4px;
	}

	.btn {
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
		transition: all 0.3s ease;
	}
</style>
