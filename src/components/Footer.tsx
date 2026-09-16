import React from 'react';
import { FileCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Resume<span className="text-indigo-400">IQ</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Optimize your resume. Improve your opportunities. Real-time ATS compatibility scoring, keyword matching, and actionable AI recommendations.
            </p>
            <p className="text-[11px] text-slate-500">
              Disclaimer: ResumeIQ is an independent evaluation tool. Compatibility scores are estimations based on common parsing heuristics and do not guarantee interview outcomes.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-display">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/ats-tips" className="hover:text-white transition-colors">
                  ATS Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Privacy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-display">
              Privacy & Guidance
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Your resume files are processed securely for document evaluation purposes.
            </p>
            <span className="inline-block px-2.5 py-1 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
              SOC-2 Type II aligned standards
            </span>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ResumeIQ. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for career acceleration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
