import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Homepage from "./pages/Homepage";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import ATSTips from "./pages/ATSTips";
import { JobsPage } from "./pages/JobsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900">

        <Navbar />

        <main>
          <Routes>

            {/* Home */}
            <Route path="/" element={<Homepage />} />

            {/* Separate Pages */}
            <Route
              path="/how-it-works"
              element={<HowItWorks />}
            />

            <Route
              path="/features"
              element={<Features />}
            />

            <Route
              path="/ats-tips"
              element={<ATSTips />}
            />

            <Route
              path="/jobs"
              element={<JobsPage />}
            />

          </Routes>
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;