import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { SunIcon } from '@heroicons/react/24/outline';
import { MoonIcon } from '@heroicons/react/24/solid';

function Navbar({ onConnectClick, theme, setTheme, walletAddress }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
  ];

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <nav
      className={`shadow-sm transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-gray-900 text-white border-b border-gray-700'
          : 'bg-white text-gray-800 border-b border-gray-100'
      }`}
    >
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg width="30" height="35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="20" r="10" stroke="#0682ff" />
                <circle cx="15" cy="20" r="6" stroke="#0682ff" strokeWidth="3" />
              </svg>
              <span className="text-2xl font-bold text-primary-600 mt-1.5">GoldenCity</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-secondary-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-7 w-14 items-center rounded-full bg-gray-300 dark:bg-gray-700 transition"
            >
              <div
                className={`absolute left-1 top-1 h-5 w-5 transform rounded-full bg-white dark:bg-blue-400 shadow-md transition-transform duration-300 ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                }`}
              >
                {theme === 'dark' ? (
                  <MoonIcon className="absolute right-[2px] top-[2px] w-4 h-4 text-gray-800 stroke-[2.5]" />
                ) : (
                  <SunIcon className="absolute right-[2px] top-[2px] w-4 h-4 text-white stroke-[2.5]" />
                )}
              </div>
            </button>

            {/* Connect button */}
            <button className="btn" onClick={onConnectClick}>
              {walletAddress ? "My Wallet" : "Connect"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-3">
            {/* Theme toggle (mobile) */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-300 dark:bg-gray-700 transition"
            >
              <div
                className={`absolute left-1 top-1 h-5 w-5 transform rounded-full bg-white dark:bg-blue-400 shadow-md transition-transform duration-300 ${
                  theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>

            <button
              type="button"
              className="text-secondary-600 hover:text-primary-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <button
                className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                onClick={() => {
                  setIsOpen(false);
                  onConnectClick();
                }}
              >
                {walletAddress ? "My Wallet" : "Connect"}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
