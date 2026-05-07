import { DEFAULT_LAT, DEFAULT_LNG } from "./defaultValues.svelte.js";
// Representation of the current state for any .svelte component to use
export const appState = $state({
  location: {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
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