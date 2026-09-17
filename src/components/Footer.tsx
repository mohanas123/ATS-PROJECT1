import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">

      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="flex flex-col justify-between gap-6 md:flex-row">

          <div>
            <Link
              to="/"
              className="text-2xl font-bold"
            >
              Resume<span className="text-purple-600">IQ</span>
            </Link>

            <p className="mt-2 text-sm text-gray-500">
              AI-powered ATS Resume Checker
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">

            <Link
              to="/how-it-works"
              className="hover:text-purple-600"
            >
              How It Works
            </Link>

            <Link
              to="/features"
              className="hover:text-purple-600"
            >
              Features
            </Link>

            <Link
              to="/ats-tips"
              className="hover:text-purple-600"
            >
              ATS Tips
            </Link>

            <Link
              to="/jobs"
              className="hover:text-purple-600"
            >
              Find Jobs
            </Link>

          </div>

        </div>

        <div className="mt-8 border-t pt-6 text-sm text-gray-500">
          © 2026 ResumeIQ. All rights reserved.
        </div>

      </div>

    </footer>
  );
}