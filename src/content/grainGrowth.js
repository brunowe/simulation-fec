export const grainGrowthReferences = Object.freeze([
  {
    authors: "R. B. Potts",
    year: 1952,
    title: "Some generalized order-disorder transformations",
    publication:
      "Mathematical Proceedings of the Cambridge Philosophical Society 48(1), 106–109",
    url: "https://doi.org/10.1017/S0305004100027419",
  },
  {
    authors:
      "N. Metropolis, A. W. Rosenbluth, M. N. Rosenbluth, A. H. Teller, and E. Teller",
    year: 1953,
    title: "Equation of State Calculations by Fast Computing Machines",
    publication: "The Journal of Chemical Physics 21(6), 1087–1092",
    url: "https://doi.org/10.1063/1.1699114",
  },
  {
    authors: "M. P. Anderson, D. J. Srolovitz, G. S. Grest, and P. S. Sahni",
    year: 1984,
    title: "Computer simulation of grain growth - I. Kinetics",
    publication: "Acta Metallurgica 32(5), 783–791",
    url: "https://doi.org/10.1016/0001-6160(84)90151-2",
  },
  {
    authors: "D. J. Srolovitz, M. P. Anderson, P. S. Sahni, and G. S. Grest",
    year: 1984,
    title:
      "Computer simulation of grain growth - II. Grain size distribution, topology, and local dynamics",
    publication: "Acta Metallurgica 32(5), 793–802",
    url: "https://doi.org/10.1016/0001-6160(84)90152-4",
  },
  {
    authors: "G. S. Grest, M. P. Anderson, and D. J. Srolovitz",
    year: 1988,
    title: "Domain-growth kinetics for the Q-state Potts model in two and three dimensions",
    publication: "Physical Review B 38(7), 4752–4760",
    url: "https://doi.org/10.1103/PhysRevB.38.4752",
  },
  {
    authors: "E. A. Holm, J. A. Glazier, D. J. Srolovitz, and G. S. Grest",
    year: 1991,
    title:
      "Effects of lattice anisotropy and temperature on domain growth in the two-dimensional Potts model",
    publication: "Physical Review A 43(6), 2662–2668",
    url: "https://doi.org/10.1103/PhysRevA.43.2662",
  },
  {
    authors: "D. Raabe",
    year: 2000,
    title: "Scaling Monte Carlo kinetics of the Potts model using rate theory",
    publication: "Acta Materialia 48(7), 1617–1628",
    url: "https://doi.org/10.1016/S1359-6454(99)00451-6",
  },
]);

export const modelParameters = Object.freeze([
  {
    name: "Grid size",
    symbol: "L",
    meaning: "Width and height of the square lattice",
    unit: "lattice sites",
  },
  {
    name: "Initial grains",
    symbol: "G₀",
    meaning: "Distinct nuclei used for periodic Voronoi initialization",
    unit: "count",
  },
  {
    name: "Seed",
    symbol: "s",
    meaning: "Integer state for the deterministic pseudo-random sequence",
    unit: "dimensionless",
  },
  {
    name: "Effective noise",
    symbol: "θ",
    meaning: "Controls the probability of accepting an uphill energy change",
    unit: "dimensionless",
  },
  {
    name: "Sweep",
    symbol: "MCS",
    meaning: "Exactly L² attempted site updates, sampled with replacement",
    unit: "algorithmic time",
  },
]);

export const modelAssumptions = Object.freeze([
  "The microstructure is represented by a two-dimensional square lattice with periodic boundaries.",
  "Each grain label is categorical. It is not a crystallographic angle, phase, or measured orientation.",
  "All unlike Moore-neighbor pairs use the same nominal boundary energy J = 1.",
  "A seeded periodic Voronoi construction is used for a legible initial structure; it is not a physical nucleation model.",
  "Site changes occur immediately, and one attempted update copies only a neighboring label.",
]);

export const modelLimitations = Object.freeze([
  "The experiment demonstrates qualitative two-dimensional coarsening; it is not calibrated to a steel, alloy, or other specific material.",
  "Sweeps are algorithmic time and lengths are reported in lattice spacings; neither is mapped to seconds or micrometres.",
  "The model does not calculate phase transformations, thermodynamic phase fractions, mechanical properties, or industrial process outcomes.",
  "Equal interaction energy omits misorientation-dependent boundary energy and mobility, texture, solute drag, particles, and external driving forces.",
  "The Moore stencil reduces simple four-neighbor pinning but retains square-lattice anisotropy, discretization, and finite-domain effects.",
  "A grain ID is counted once even if updates fragment it into disconnected regions.",
]);

export const modelAlgorithm = Object.freeze([
  "Choose one lattice site uniformly at random.",
  "Choose one of its eight periodic Moore neighbors uniformly and propose copying that neighbor's label.",
  "Evaluate the local change in unlike-neighbor energy, Δε = εafter − εbefore.",
  "Accept every move with Δε ≤ 0. For Δε > 0 and θ > 0, accept with probability exp(−Δε / θ); reject uphill moves when θ = 0.",
  "Apply accepted changes immediately. Repeat L² attempts to complete one Monte Carlo sweep.",
]);
