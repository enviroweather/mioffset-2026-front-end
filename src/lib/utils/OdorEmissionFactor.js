// E = (oenRate * odorControlFactor * area) / 10000
// Equation taken from legacy code
// area in sq ft, odor control factor is transmission fraction (1.0 for no technology)
export function CalculateTotalEmission(oenRate, odorControlFactor, area) {
	// Undefined Check
	if (
		oenRate == null ||
		odorControlFactor == null ||
		area == null ||
		area === ""
	)
		return null;

	return (oenRate * odorControlFactor * Number(area)) / 10000;
}
