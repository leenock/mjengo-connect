"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define types
interface NavItem {
  href: string;
  label: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Scroll effect for background change
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const navItems: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/about_us", label: "About us" },
    { href: "/contact-us", label: "Contact us" },
  ];

  const router = useRouter();

  const handleClick = () => {
    router.push("/coming-soon"); // Navigate to /download
  };

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-xl border-b border-gray-100"
            : "bg-white shadow-lg"
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 lg:py-4">
            {/* Logo */}
            <div className="flex items-center z-50 relative">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/images/logo4.png"
                  alt="MJENGO Connect Logo"
                  width={220}
                  height={0}
                  priority
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center space-x-1"
              aria-label="Main navigation"
            >
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-gray-700 hover:text-orange-600 font-medium text-sm xl:text-base transition-all duration-300 group rounded-lg hover:bg-orange-50"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={handleLinkClick}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-black to-orange-600 transition-all duration-300 group-hover:w-4/5 transform -translate-x-1/2 rounded-full"></span>
                </a>
              ))}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex items-center">
              <a
                href="/coming-soon"
                className="group relative px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm xl:text-base transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-500/25 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
                type="button"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 4h10v13H7V4zm2 15h6v1H9v-1z" />
                  </svg>
                  <span>Download App</span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden z-50 relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors duration-300 rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                type="button"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-out ${
                      isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-out mt-1.5 ${
                      isMenuOpen ? "opacity-0 scale-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-out mt-1.5 ${
                      isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-out ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-500 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsMenuOpen(false);
            }
          }}
          aria-hidden="true"
        ></div>

        {/* Mobile Menu */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl transform transition-all duration-500 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div
              id="mobile-menu-title"
              className="flex items-center justify-between p-6 border-b border-gray-100"
            >
              <div className="text-lg font-semibold text-gray-900">Menu</div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Close menu"
                type="button"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-6 py-6" aria-label="Mobile navigation">
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="group flex items-center px-4 py-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl font-medium transition-all duration-300 transform hover:translate-x-1"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: isMenuOpen
                        ? "slideInRight 0.5s ease-out forwards"
                        : "none",
                    }}
                  >
                    <span className="text-base">{item.label}</span>
                    <svg
                      className="w-4 h-4 ml-auto text-gray-400 group-hover:text-orange-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </nav>

            {/* CTA */}
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={handleClick}
                className="group w-full px-6 py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-semibold transition-all duration-300 hover:from-black hover:to-gray-900 hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-gray-700"
                type="button"
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 4h10v13H7V4zm2 15h6v1H9v-1z" />
                  </svg>
                  <span>Download App</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Header;
