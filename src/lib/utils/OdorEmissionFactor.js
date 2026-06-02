// E = (oenRate * odorControlFactor * area) / 10000
// Equation taken from legacy code
// area in sq ft, odor control factor is transmission fraction (1.0 for no technology)
export function CalculateTotalEmission(oenRate, odorControlFactor, area) {
	// Undefined Check
	if (
		oenRate == null ||
		odorControlFactor == null ||
		area == null ||
		area === "" // area comes from <input type="number"> and arrives as "" before the user types;
		            // other params come from dropdowns and arrive as null
	)
		return null;

	// Number(area) coerces the string input value to a number;
	// the checks above guarantee it is non-null and non-empty here.
	return (oenRate * odorControlFactor * Number(area)) / 10000;
}
