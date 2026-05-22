<script>
	// --- Imports ---
	import {
		appState,
		entries,
		representResults,
	} from "$lib/stores/appState.svelte.js";

	let { interactive = true } = $props();
	// --- Actions ---
	function restoreEntry(entryData, index) {
		if (!interactive) return;
		Object.assign(appState.location, entryData.snapshot.location);
		Object.assign(
			appState.formDrafts[entryData.snapshot.activeForm],
			entryData.snapshot.formDraft,
		);
		appState.activeForm = entryData.snapshot.activeForm;
		entries.splice(index, 1);
	}

	function removeEntry(e, i) {
		if (!interactive) return;
		e.stopPropagation(); // prevent row's "restoreEntry" onclick from also firing
		entries.splice(i, 1);
	}

	// --- Helpers ---
	function emissionData(entry) {
		return entry.type === "storage" ? entry.storage : entry.odor;
	}

	// --- Derived ---
	let totalOEF = $derived(
		entries.reduce((sum, e) => sum + (emissionData(e).totalEmission ?? 0), 0),
	);
</script>

<section class="entries-section">
	<!-- Section Header -->
	<div class="entries-header">
		<div class="header-left">
			<h2>Submitted Entries</h2>
			<span class="entry-count"
				>{entries.length} {entries.length === 1 ? "entry" : "entries"}</span
			>
		</div>
	</div>
	<!-- Data Table -->
	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					<th>#</th>
					<th>Species</th>
					<th>Animal Type</th>
					<th>Housing Type</th>
					<th>Storage Type</th>
					<th>Technology</th>
					<th>Area (sq ft)</th>
					<th>Odor Emission Rate</th>
					<th>Odor Control Factor</th>
					<th>Total Odor Emission</th>
					<th></th>
				</tr>
			</thead>
			<tbody class:non-interactive={!interactive}>
				{#each entries as entry, i}
					{@const d = emissionData(entry)}
					<tr onclick={() => restoreEntry(entry, i)}>
						<td class="entry-num">{i + 1}</td>
						<td>{d.species || "-"}</td>
						<td>{d.animalType || "-"}</td>
						<td>{d.housingType || "-"}</td>
						<td>{d.storageType || "-"}</td>
						<td>{d.technology || "-"}</td>
						<td>{d.area != null && d.area !== "" ? d.area : "-"}</td>
						<td class="numeric">{d.oenRate != null ? d.oenRate : "-"}</td>
						<td class="numeric"
							>{d.odorControlFactor != null ? d.odorControlFactor : "-"}</td
						>
						<td class="numeric"
							>{d.totalEmission != null ? d.totalEmission.toFixed(2) : "-"}</td
						>
						<td class="remove-cell">
							<button
								class="remove-btn"
								onclick={(e) => removeEntry(e, i)}
								aria-label="Remove entry">×</button
							>
						</td>
					</tr>
				{/each}
				<tr class="total-row">
					<td>
						<div class="submission-btn">
							<button class="btn-footprint" onclick={representResults}
								>Show Footprint</button
							>
						</div>
					</td>
					<td colspan="8"></td>
					<td class="numeric total-value">{totalOEF.toFixed(2)}</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
</section>

<style>
	/* Header */
	.entries-section {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		padding: 1rem 1.5rem;
	}

	.entries-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2px solid #4caf50;
		padding-bottom: 0.75rem;
		margin-bottom: 1rem;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.header-left {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
	}

	.entries-header h2 {
		margin: 0;
		color: #2c3e50;
		font-size: 1.5rem;
	}

	.entry-count {
		color: #666;
		font-size: 0.9rem;
	}

	/* Submit Button */
	.submission-btn {
		display: flex;
		margin-top: 0.5rem;
		min-width: 170px;
	}
	.btn-footprint {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		background-color: var(--color-kelly-green);
		color: white;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		transition: all 0.3s ease;
	}
	.btn-footprint:hover {
		background-color: #008934;
		box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
		transform: scaleX(1.03);
	}
	.btn-footprint:active {
		background-color: #008934;
		transform: translateY(1px);
	}
	/* Table */
	.table-wrapper {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
		min-width: 600px;
	}

	thead tr {
		background-color: #f5f5f5;
	}

	th {
		text-align: left;
		padding: 0.6rem 0.75rem;
		font-weight: 600;
		color: #2c3e50;
		border-bottom: 2px solid #ddd;
	}

	td {
		padding: 0.6rem 0.75rem;
		border-bottom: 1px solid #eee;
		color: #333;
	}

	tbody:not(.non-interactive) tr:not(.total-row) {
		cursor: pointer;
	}

	tbody:not(.non-interactive) tr:hover:not(.total-row) {
		background-color: #f9fffe;
	}

	/* Totals Row */
	.total-row td {
		border-top: 2px solid #4caf50;
		background-color: #f5f5f5;
		border-bottom: none;
	}

	.total-value {
		font-weight: 700;
		color: #2c3e50;
	}

	/* Remove Button */
	.remove-cell {
		padding: 0 0.4rem;
		text-align: center;
	}

	.remove-btn {
		background: none;
		border: none;
		color: #aaa;
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		transition:
			color 0.2s,
			background 0.2s;
	}

	.remove-btn:hover {
		color: #e74c3c;
		background: #fdf0ee;
	}

	/* Numeric Cells */
	.entry-num {
		font-weight: 700;
		color: #4caf50;
		text-align: center;
	}

	.numeric {
		font-variant-numeric: tabular-nums;
		text-align: left;
	}
</style>
