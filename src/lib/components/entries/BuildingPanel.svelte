<script>
	import AnimalForm from "./AnimalForm.svelte";
	import StorageForm from "./StorageForm.svelte";
	import ManualForm from "./ManualForm.svelte";
	import {
		appState,
		buildings,
		site,
		setBuildingType,
		clearBuildingFields,
		removeBuilding,
	} from "$lib/state/appState.svelte.js";
	import { deriveEmission } from "$lib/utils/model/OdorEmissionFactor.js";
	import { BUILDING_LATLNG_PRECISION } from "$lib/state/defaultValues.svelte.js";

	const subtitles = {
		animal: "Animal housing - species, housing type and footprint",
		storage: "Manure storage - storage type and surface area",
		manual: "Enter this structure's Odor Emission Factor directly",
	};

	let selected = $derived(site.selected);
	let emission = $derived(selected ? deriveEmission(selected) : null);

	function format(value, digits = 2) {
		return value == null ? "-" : Number(value).toFixed(digits);
	}
</script>

<div class="building-panel">
	{#if !selected}
		<!-- Empty state -->
		<div class="empty">
			<h2>No building selected</h2>
			<p>
				Drag <strong>Add building</strong> from the bottom-left of the map onto the
				spot where a structure sits, then click its marker to enter its details here.
			</p>
			{#if buildings.length > 0}
				<ul class="quick-list">
					{#each buildings as building (building.id)}
						<li>
							<button
								class="quick-item"
								onclick={() => (appState.selectedId = building.id)}
							>
								<span class="quick-name"
									>{building.name || "Unnamed building"}</span
								>
								<span class="quick-oef"
									>{format(deriveEmission(building).totalEmission)}</span
								>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{:else}
		<!-- Header: identity + removal -->
		<div class="panel-header">
			<div class="name-row">
				<label class="name-label" for="building-name">Building name</label>
				<button
					class="remove-btn"
					onclick={() => removeBuilding(selected.id)}
					aria-label="Remove this building">Remove</button
				>
			</div>
			<input
				id="building-name"
				class="name-input"
				type="text"
				bind:value={selected.name}
				placeholder="e.g. Egg Laying Hen Housing"
			/>

			<!-- Position is set by dragging the marker; shown here as read-only data -->
			<div class="coords" aria-label="Building position">
				<span class="coord">
					<span class="coord-label">Lat</span>
					<span class="coord-value"
						>{selected.lat.toFixed(BUILDING_LATLNG_PRECISION)}</span
					>
				</span>
				<span class="coord">
					<span class="coord-label">Lng</span>
					<span class="coord-value"
						>{selected.lng.toFixed(BUILDING_LATLNG_PRECISION)}</span
					>
				</span>
				<span class="coord-hint">drag the marker to move</span>
			</div>
		</div>

		<!-- Source type -->
		<div class="type-selector">
			<div class="form-tabs" role="group" aria-label="Odor source type">
				<button
					class="tab"
					class:active={selected.formType === "animal"}
					onclick={() => setBuildingType(selected.id, "animal")}>Animal</button
				>
				<button
					class="tab"
					class:active={selected.formType === "storage"}
					onclick={() => setBuildingType(selected.id, "storage")}
					>Storage</button
				>
				<button
					class="tab"
					class:active={selected.formType === "manual"}
					onclick={() => setBuildingType(selected.id, "manual")}>Manual</button
				>
			</div>
			<p class="subtitle">{subtitles[selected.formType]}</p>
		</div>

		<!-- Steps. Keyed so number inputs remount with their own display state
		     when the user switches to a different building. -->
		{#key selected.id + selected.formType}
			{#if selected.formType === "animal"}
				<AnimalForm building={selected} />
			{:else if selected.formType === "storage"}
				<StorageForm building={selected} />
			{:else}
				<ManualForm building={selected} />
			{/if}
		{/key}

		<!-- Calculated columns, matching the worksheet -->
		<dl class="calculated">
			<div class="calc-item" title="Odor Emission Number">
				<dt>OEN</dt>
				<dd>{format(emission.oenRate, 0)}</dd>
			</div>
			<div class="calc-item" title="Odor Control Factor">
				<dt>OCF</dt>
				<dd>{format(emission.odorControlFactor)}</dd>
			</div>
			<div class="calc-item emphasis" title="Odor Emission Factor">
				<dt>OEF</dt>
				<dd>{format(emission.totalEmission)}</dd>
			</div>
		</dl>

		<div class="panel-actions">
			<button
				class="btn btn-secondary"
				onclick={() => clearBuildingFields(selected.id)}>Clear Fields</button
			>
			<button
				class="btn btn-primary"
				onclick={() => (appState.selectedId = null)}>Done</button
			>
		</div>

		<p class="site-total">
			Site total OEF <strong>{format(site.totalOEF)}</strong> across {buildings.length}
			{buildings.length === 1 ? "building" : "buildings"}
		</p>
	{/if}
</div>

<style>
	.building-panel {
		background: white;
		padding: 1.1rem 1.25rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	/* Empty state */
	.empty h2 {
		margin: 0 0 0.5rem 0;
		color: #2c3e50;
		font-size: 1.35rem;
	}

	.empty p {
		margin: 0 0 0.75rem 0;
		color: #666;
		font-size: 0.9rem;
		line-height: 1.45;
	}

	.empty-note {
		font-size: 0.82rem;
		color: #888;
		border-left: 3px solid var(--color-kelly-green);
		padding-left: 0.6rem;
	}

	.quick-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.quick-item {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.5rem;
		width: 100%;
		padding: 0.4rem 0.5rem;
		border: 1px solid #eee;
		border-radius: 4px;
		background: #fafafa;
		font-family: inherit;
		font-size: 0.85rem;
		color: #2c3e50;
		cursor: pointer;
		text-align: left;
	}

	.quick-item:hover {
		border-color: var(--color-kelly-green);
		background: #f6fbf6;
	}

	.quick-oef {
		font-variant-numeric: tabular-nums;
		color: #666;
	}

	/* Header */
	.panel-header {
		border-bottom: 2px solid #4caf50;
		padding-bottom: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.name-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.name-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: #555;
	}

	.name-input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: inherit;
		font-size: 1.05rem;
		font-weight: 600;
		color: #2c3e50;
		width: 100%;
	}

	.name-input:focus {
		outline: none;
		border-color: #4caf50;
		box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
	}

	.coords {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		align-self: center;
		gap: 0.75rem;
		font-size: 0.8rem;

	}

	.coord-label {
		color: #888;
		margin-right: 0.25rem;
	}

	.coord-value {
		font-variant-numeric: tabular-nums;
		color: #2c3e50;
		font-weight: 600;
	}

	.coord-hint {
		color: #aaa;
		font-style: italic;
	}

	.remove-btn {
		background: none;
		border: 1px solid transparent;
		color: #c0392b;
		font-family: inherit;
		font-size: 0.8rem;
		padding: 0.15rem 0.4rem;
		border-radius: 3px;
		cursor: pointer;
	}

	.remove-btn:hover {
		background: #fdf0ee;
		border-color: #e74c3c;
	}

	/* Source type */
	.type-selector {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.form-tabs {
		display: flex;
		gap: 0.5rem;
	}

	.tab {
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		font-family: inherit;
		font-size: 0.95rem;
		color: #2c3e50;
		transition:
			color 0.15s,
			border-color 0.15s;
	}

	.tab:hover,
	.tab.active {
		color: #4caf50;
		border-bottom-color: #4caf50;
	}

	.subtitle {
		margin: 0;
		color: #666;
		font-size: 0.85rem;
	}

	/* Calculated columns - condensed to a single row */
	.calculated {
		margin: 0;
		display: flex;
		align-items: stretch;
		background: #f7f9f7;
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
	}

	.calc-item {
		flex: 1;
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.4rem;
		padding: 0 0.5rem;
		border-left: 1px solid #dde5dd;
	}

	.calc-item:first-child {
		border-left: none;
	}

	.calc-item dt {
		font-size: 0.72rem;
		font-weight: 600;
		color: #888;
		letter-spacing: 0.3px;
	}

	.calc-item dd {
		margin: 0;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		color: #2c3e50;
		font-size: 0.95rem;
	}

	.calc-item.emphasis dd {
		color: var(--color-kelly-green);
	}

	/* Actions */
	.panel-actions {
		display: flex;
		gap: 0.75rem;
	}

	.btn {
		flex: 1;
		padding: 0.5rem;
		border: none;
		border-radius: 4px;
		font-family: inherit;
		font-size: 0.95rem;
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
	}

	.btn-secondary {
		background-color: #95a5a6;
		color: white;
	}

	.btn-secondary:hover {
		background-color: #7f8c8d;
	}

	.site-total {
		margin: 0;
		font-size: 0.82rem;
		color: #666;
		text-align: center;
	}

	.site-total strong {
		font-variant-numeric: tabular-nums;
		color: #2c3e50;
	}
</style>
