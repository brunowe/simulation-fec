import { Link, NavLink } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link aria-label="Simulation Lab home" className="brand" to="/">
          <span aria-hidden="true" className="brand__mark">
            BW
          </span>
          <span className="brand__text">
            <strong>Simulation Lab</strong>
            <small>Bruno Weber</small>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="site-nav">
          <NavLink to="/">Projects</NavLink>
          <a href="https://github.com/brunowe/simulation-fec">Source</a>
        </nav>
      </div>
    </header>
  );
}
