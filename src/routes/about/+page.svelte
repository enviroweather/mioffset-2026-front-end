<!-- Intro & Description -->
<div class="about-container">
	<h1>MI OFFSET 2018</h1>
	<h2>
		A tool for evaluating odor setback distance to minimize odor nuisance
		complaints.
	</h2>
	<p>
		Developed in cooperation with and sponsored by
		<a href="https://www.canr.msu.edu/maaa/">
			Michigan Alliance for Animal Agriculture (M-AAA)</a
		>
		and
		<a href="http://www.michigan.gov/mdard/">
			Michigan Department of Agriculture and Rural Development (MDARD)</a
		>.
	</p>
	<p>
		MI OFFSET is a planning tool for assessing potential odor impacts from
		livestock facilities. output from this tool, called an odor footprint, is a
		radial plot which represents approximate distances that one must be away
		from the odor source to detect a noticeable or stronger odor up to 1.5%, 3%
		and 5% of the time for each of the 16 compass directions. MI OFFSET 2018 is
		a revised version of the previous release of MI OFFSET (originally known as
		Michigan Odor Print) that improves its ability to minimize odor nuisance
		risk when siting new or expanding livestock operations, through changes to
		the existing climatological dataset of wind and atmospheric stability.
		<a class="pdf" href="MIOFFSET2018_technicaldocument.pdf"
			>Technical details of the model are available in PDF format</a
		>. MI OFFSET 2018 has been implemented in the
		<a href="https://www.michigan.gov/mdard/0,4610,7-125-1599_1605---,00.html"
			>Site Selection Generally Accepted Agricultural and Management Practices
			(GAAMPs) document.</a
		>
		On 2/28/20, a revised version of MI OFFSET 2018 was released that includes a
		minor change to the underlying program to correct an error in the calculation
		of the wind direction climatology. This revision should not affect most users.
	</p>

	<p>
		MI OFFSET 2018 has been approved by MDARD for use in Michigan. Users
		interested in siting guidance for farms outside of Michigan should refer to
		the regulations and/or guidelines in place in those states or provinces. By
		using this product, you agree to the <a href="viewMioffsetTerms.php"
			>Terms of Use</a
		>.
	</p>

	<p>
		You will receive odor footprint plots and a table of setback distance, and
		have an opportunity to download the odor footprint as a KML file or a
		Shapefile, for export to GIS applications.
	</p>

	<!-- Usage Steps -->
	<div class="modelPreText">
		To use this tool:
		<ol class="breadcrumbs">
			<li class="breadcrumb active"><p>Page 1: Enter your location</p></li>
			<li class="breadcrumb">
				<p>Page 2: Enter details about animal units and waste storage</p>
			</li>
			<li class="breadcrumb"><p>Page 3: View and download results</p></li>
		</ol>
	</div>
	<br />
</div>

<style>
	/* Typography */
	.about-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
		line-height: 1.6;
	}

	h1 {
		color: var(--color-spartan-green);
		margin-bottom: 1rem;
	}

	h2 {
		color: var(--color-kelly-green);
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	p {
		color: #333;
		margin-bottom: 1rem;
	}

	/* Links */
	a {
		color: var(--color-kelly-green);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	a:hover {
		color: var(--color-spartan-green);
		text-decoration: underline;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.about-container {
			padding: 1rem;
		}

		h1 {
			font-size: 1.5rem;
		}

		h2 {
			font-size: 1.25rem;
		}
	}
</style>
