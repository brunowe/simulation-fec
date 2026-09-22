export const weldVisionMethodSteps = Object.freeze([
  Object.freeze({
    number: "01",
    title: "Define the visual target",
    copy: "Describe the boundary in image coordinates and preserve an explicit non-measurable state.",
  }),
  Object.freeze({
    number: "02",
    title: "Freeze development choices",
    copy: "Select the robust configuration using only the development video and record every parameter.",
  }),
  Object.freeze({
    number: "03",
    title: "Evaluate a second condition",
    copy: "Apply the frozen configuration unchanged to a second optical recording condition.",
  }),
  Object.freeze({
    number: "04",
    title: "Keep failure states visible",
    copy: "Report false positives, uncertainty, and cases where no boundary should be returned.",
  }),
]);

export const weldVisionMetrics = Object.freeze([
  Object.freeze({
    label: "Validation references",
    value: "48",
    note: "24 visible and 24 empty masks",
  }),
  Object.freeze({
    label: "Balanced accuracy",
    value: "0.9792",
    note: "Second recording condition",
  }),
  Object.freeze({
    label: "Mean Dice",
    value: "0.9761",
    note: "Robust V2 configuration",
  }),
  Object.freeze({
    label: "Mean IoU",
    value: "0.9534",
    note: "Image-domain agreement",
  }),
  Object.freeze({
    label: "Curve MAE",
    value: "4.65 px",
    note: "No metrological calibration",
  }),
]);

export const weldVisionAssumptions = Object.freeze([
  "The target is a deliberately defined visual boundary in the image domain.",
  "The development and validation videos are separate recording conditions from the same dataset and campaign.",
  "A maximum lateral deviation of 8 pixels is a geometry-specific continuity assumption selected on development data.",
  "Source timing follows the acquisition information supplied with the dataset, not the playback speed of a derived video.",
]);

export const weldVisionLimitations = Object.freeze([
  "Both videos come from the same dataset, equipment, material, and experimental campaign.",
  "The 96-mask reference was produced by one reviewer with intensity-assisted annotation and is not an independent gold standard.",
  "One false positive remains in the validation condition.",
  "Geometric outputs remain in pixels and have no metrological calibration.",
  "No synchronized inspection, defect, or weld-quality labels were available.",
  "Offline throughput is specific to the documented hardware and image resolution.",
]);

export const weldVisionDemonstrates = Object.freeze([
  "A deterministic image-processing pipeline can estimate the defined visual boundary across two recording conditions from the same dataset.",
  "A parameter selected only on development data improved geometric agreement on the second condition.",
  "Explicit non-measurable states can be preserved instead of forcing a continuous detection.",
  "The full 8,561-frame sequence can produce reproducible per-frame data, quality flags, a structured summary, and an annotated inspection video.",
]);

export const weldVisionDoesNotDemonstrate = Object.freeze([
  "Identification of a melt pool, keyhole, phase, temperature, or solidification event.",
  "Detection of defects or prediction of weld quality.",
  "Industrial generalization, metrological accuracy, or physical causality.",
  "Real-time acquisition performance or closed-loop control.",
]);

export const weldVisionReferences = Object.freeze([
  Object.freeze({
    title: "High speed videos of laser beam welding with dynamic beam shaping",
    authors: "Reshad Bakhtari and Pasquale Franciosa",
    source: "University of Warwick / Zenodo",
    detail: "Source data for the optical cycle. CC BY 4.0.",
    href: "https://doi.org/10.5281/zenodo.19882091",
    linkLabel: "DOI 10.5281/zenodo.19882091",
  }),
  Object.freeze({
    title: "Dataset for Weld Seam Analysis and Discontinuity Prediction for Laser Beam Butt Welding",
    authors: "Thermal-cycle source dataset",
    source: "Figshare",
    detail: "Documented source for the separate thermal research track. CC BY 4.0.",
    href: "https://doi.org/10.6084/m9.figshare.27877413.v1",
    linkLabel: "DOI 10.6084/m9.figshare.27877413.v1",
  }),
  Object.freeze({
    title: "Dataset for weld seam analysis and discontinuity prediction in laser beam welding scenarios",
    authors: "Dataset description article",
    source: "Data in Brief",
    detail: "Primary description associated with the thermal-cycle dataset.",
    href: "https://doi.org/10.1016/j.dib.2025.111381",
    linkLabel: "DOI 10.1016/j.dib.2025.111381",
  }),
]);
