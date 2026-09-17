import { NavLink } from "react-router-dom";

const navItems = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "How It Works",
    path: "/how-it-works",
  },
  {
    name: "Features",
    path: "/features",
  },
  {
    name: "ATS Tips",
    path: "/ats-tips",
  },
  {
    name: "Find Jobs",
    path: "/jobs",
  },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold tracking-tight"
        >
          Resume<span className="text-purple-600">IQ</span>
        </NavLink>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

        </div>

        {/* Mobile / CTA */}
        <NavLink
          to="/jobs"
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
        >
          Find Jobs
        </NavLink>

      </div>
    </nav>
  );
}