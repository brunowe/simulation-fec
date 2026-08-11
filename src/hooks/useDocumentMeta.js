import { useEffect } from "react";

const SITE_NAME = "Bruno Weber - Simulation Lab";
const SITE_URL = "https://gallant-tesla-a765dd.netlify.app";
const DEFAULT_DESCRIPTION =
  "Interactive numerical experiments across science and engineering by Bruno Weber.";

function setMeta(name, content, attribute = "name") {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.append(element);
  }

  element.setAttribute("content", content);
}

function setCanonical(pathname) {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.append(element);
  }

  const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const url = `${SITE_URL}${path}`;
  element.setAttribute("href", url);
  setMeta("og:url", url, "property");
}

export function useDocumentMeta({
  canonicalPath,
  description = DEFAULT_DESCRIPTION,
  noIndex = false,
  title,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;
    setCanonical(canonicalPath);
    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("robots", noIndex ? "noindex, follow" : "index, follow");
  }, [canonicalPath, description, noIndex, title]);
}
