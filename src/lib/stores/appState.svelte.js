// Representation of the current state for any .svelte component to use
export const appState = $state({
  location: {
    lat: 42.72927458118972,
    lng: -84.47281270368809,
    address: '',
    mode: 'address', // 'address' | 'coords'
  },
  odor: {
    species: '',
    animalType: '',
    housingType: '',
    technology: '',
    area: '',
  }
});