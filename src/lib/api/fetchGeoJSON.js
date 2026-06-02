export async function fetchResults(lat, lng, odor_index) {
	// Internally the app uses Leaflet's `lng` convention; the API expects the standard geographic `lon`.
	const params = new URLSearchParams({ lat, lon: lng, odor_index: odor_index});
	
	const res = await fetch(`/api/forecast?${params}`);
	if (!res.ok)
		throw new Error(`Failed to fetch forecast: ${res.status} ${res.statusText}`);
	return res.json();
}