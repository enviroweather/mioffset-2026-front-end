export async function fetchResults(url = "example_fod_output.json") {
	const res = await fetch(url);
	if (!res.ok)
		throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
	return res.json();
}
