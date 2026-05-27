<div class="spinner-wrapper">
	<div class="spinner"></div>
</div>

<style>
	.spinner-wrapper {
		display: flex;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		background-color: var(--color-spartan-white);
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
	.spinner {
		margin: auto;
		width: 40px;
		height: 40px;
		border: 4px solid var(--color-kelly-green);
		border-top: 4px solid var(--color-spartan-white);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
