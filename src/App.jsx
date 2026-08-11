import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const GrainGrowthPage = lazy(
  () => import("./simulations/grain-growth/GrainGrowthPage"),
);

function RouteFallback() {
  return (
    <main className="route-fallback" id="main-content" tabIndex={-1}>
      <div aria-hidden="true" className="route-fallback__pulse" />
      <p>Loading experiment…</p>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route
          element={
            <Suspense fallback={<RouteFallback />}>
              <GrainGrowthPage />
            </Suspense>
          }
          path="/simulations/grain-growth"
        />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
