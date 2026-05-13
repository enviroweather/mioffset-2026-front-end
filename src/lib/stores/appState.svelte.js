import { DEFAULT_LAT, DEFAULT_LNG } from "./defaultValues.svelte.js";
// Representation of the current state for any .svelte component to use
export const appState = $state({
  location: {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    address: '',
    mode: 'address', // 'address' | 'coords'
    oen_rate: 0,
    odorControlFactor: 0
  },
  odor: {
    species: '',
    animalType: '',
    housingType: '',
    technology: '',
    area: '',
  }
});