// --- Map Constants ---
export const DEFAULT_LAT = 44.347418;
export const DEFAULT_LNG = -85.410177;
export const DEFAULT_ZOOM = 6.5;
export const MIN_ZOOM = 6;
export const MAX_ZOOM = 18
export const LANDMARK_ZOOM = 12;
export const LATLNG_PRECISION = 4;
// --- Default Location ---
export const DEFAULT_LOCATION = {
  lat: DEFAULT_LAT,
  lng: DEFAULT_LNG,
  zoom: MIN_ZOOM,
  address: '',
  mode: 'address',
  hasSelection: true,
};

// --- Default Odor ---
export const DEFAULT_ODOR = {
  species: '',
  animalType: '',
  housingType: '',
  technology: '',
  area: '',
  oenRate: null,
  odorControlFactor: null,
  totalEmission: null,
};

