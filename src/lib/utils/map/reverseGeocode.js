export async function reverseGeocode(lat, lng) {
	try {
		const res = await fetch(`/api/reverseGeocoding?lat=${lat}&lng=${lng}`);
		if (!res.ok) throw new Error(`API call failed with status ${res.status}`);
		const data = await res.json();
		return data.addresses?.[0]?.address?.freeformAddress ?? null;
	} catch (error) {
		console.error("Reverse geocoding error:", error);
		return null;
	}
}
