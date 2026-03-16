import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/curriculum', label: 'Curriculum' },
    { path: '/alumni', label: 'Alumni' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getDashboardPath = () => {
    if (!user) return '/login';
    return `/portal/${user.role}`;
  };

  return (
    <nav className="bg-navy-900 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center
                          text-white font-display font-bold text-lg
                          group-hover:bg-primary-400 transition-colors">
              VB
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-display font-bold text-lg leading-tight block">
                Vidya Bharati
              </span>
              <span className="text-navy-300 text-xs font-body tracking-wider uppercase">
                International School
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-body font-semibold transition-all duration-200
                  ${isActive(link.path)
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-navy-200 hover:text-white hover:bg-navy-800'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-8 bg-navy-700 mx-2" />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="px-4 py-2 rounded-lg text-sm font-body font-semibold
                           bg-primary-600/20 text-primary-300 hover:bg-primary-600 hover:text-white
                           transition-all duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-sm font-body font-semibold
                           text-navy-300 hover:text-white hover:bg-red-600/80
                           transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary text-sm py-2"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-navy-200 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-800 border-t border-navy-700">
          <div className="px-4 py-3 space-y-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-body font-semibold transition-all
                  ${isActive(link.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-navy-200 hover:bg-navy-700'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-navy-700 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-sm font-body font-semibold text-primary-300 hover:bg-navy-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-body font-semibold text-red-400 hover:bg-navy-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-body font-semibold text-primary-400 hover:bg-navy-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
