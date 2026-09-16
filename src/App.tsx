import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import HomePage from './pages/Homepage';
import HowItWorksPage from './pages/HowItWorks';
import FeaturesPage from './pages/Features';
import ATSTipsPage from './pages/ATSTips';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAnalyzeClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => {
        document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
      return;
    }

    document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="no-print">
        <Navbar onAnalyzeClick={handleAnalyzeClick} />
      </div>

      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* How It Works Page */}
        <Route path="/how-it-works" element={<HowItWorksPage />} />

        {/* Features Page */}
        <Route path="/features" element={<FeaturesPage />} />

        {/* ATS Tips Page */}
        <Route path="/ats-tips" element={<ATSTipsPage />} />
      </Routes>

      <div className="no-print mt-auto">
        <Footer />
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
