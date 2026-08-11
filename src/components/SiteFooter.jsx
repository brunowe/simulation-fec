export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Bruno Weber - Simulation Lab</strong>
        <p>Interactive numerical experiments across science and engineering.</p>
      </div>
      <div className="site-footer__meta">
        <span>Experimental software · 2026</span>
        <a href="https://github.com/brunowe/simulation-fec">
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}
