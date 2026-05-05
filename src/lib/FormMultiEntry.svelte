<!-- FormMultiEntry.svelte -->
<script>
  import FormWizard from './FormWizard.svelte';

  let { steps, defaultFormState, direction = 'column', submitLabel = 'Submit', resetLabel = 'Clear', onSubmit } = $props();

  let entries = $state([structuredClone(defaultFormState)]);

  function addEntry() {
    entries.push(structuredClone(defaultFormState));
  }

  function removeEntry(index) {
    entries.splice(index, 1);
  }

  function handleSubmitAll() {
    onSubmit?.(entries);
  }

  function handleResetAll() {
    entries = [structuredClone(defaultFormState)];
  }
</script>

<div class="multi-entry" style="flex-direction: {direction}">
  {#each entries as entry, i (i)}
    <div class="entry">
      <div class="entry-header">
        <span>Entry {i + 1}</span>
        {#if entries.length > 1}
          <button class="btn btn-secondary" onclick={() => removeEntry(i)}>
            Remove
          </button>
        {/if}
      </div>
      <FormWizard {steps} bind:formState={entries[i]} />
    </div>
  {/each}

  <div class="multi-actions">
    <button class="btn btn-secondary" onclick={addEntry}>+ Add Entry</button>
    <div class="form-actions">
      <button class="btn btn-primary" onclick={handleSubmitAll}>{submitLabel}</button>
      <button class="btn btn-secondary" onclick={handleResetAll}>{resetLabel}</button>
    </div>
  </div>
</div>

<style>
  .multi-entry {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .entry {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 1rem;
  }

  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .multi-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
  }
</style>