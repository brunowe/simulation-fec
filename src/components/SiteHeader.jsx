import { Link, NavLink } from "react-router-dom";

import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link aria-label="Simulation Lab home" className="brand" to="/">
          <span aria-hidden="true" className="brand__mark">
            <img alt="" src="/simulation-lab-symbol-09.png" />
          </span>
          <span className="brand__text">
            <strong>Simulation Lab</strong>
            <small>Bruno Weber</small>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="site-nav">
          <NavLink to="/">Projects</NavLink>
          <a href="https://github.com/brunowe/simulation-fec" rel="noopener noreferrer" target="_blank">
            Source <span aria-hidden="true">&#8599;</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
