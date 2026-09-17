export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Bruno Weber - Simulation Lab</strong>
        <p>Interactive numerical experiments across science and engineering.</p>
      </div>
      <div className="site-footer__meta">
        <span>Experimental software / 2026</span>
        <a href="https://github.com/brunowe/simulation-fec" rel="noopener noreferrer" target="_blank">
          GitHub <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </footer>
  );
}
