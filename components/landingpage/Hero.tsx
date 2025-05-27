"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-gradient-to-br from-yellow-50 via-white to-yellow-50 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply blur-xl animate-pulse" />
        <div className="absolute top-40 right-10 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply blur-xl animate-pulse delay-2000" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gray-400 rounded-full mix-blend-multiply blur-xl animate-pulse delay-4000" />
      </div>

      <div className="relative z-10 px-6 sm:px-10 lg:px-20 xl:px-28 pt-20 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-screen-xl mx-auto min-h-[calc(100vh-6rem)]">
          {/* Left - Text */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-yellow-200 text-yellow-900 rounded-full text-sm font-medium border border-yellow-300 mb-4">
              <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2 animate-pulse" />
              🚧 Connecting Kenya Construction Industry
            </div>

            {/* Heading */}
            <div className="space-y-4 max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-bold leading-tight tracking-tight text-gray-900">
                <span>Connecting </span>
                <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Skilled Fundis
                </span>
                <br />
                <span>with Construction</span>
                <br />
                <span className="text-gray-700">Services</span>
              </h1>
              <div className="w-20 h-1.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full" />
            </div>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl font-[Inter] tracking-tight">
              Whether you are building, renovating, or repairing — quickly find
              skilled{" "}
              <span className="font-semibold text-balance text-orange-600 italic">
                fundis, masons, plumbers, painters, welders, and electricians
              </span>{" "}
              near you. <br className="hidden sm:inline" />
              <span className="block mt-4 text-lg sm:text-xl lg:text-balance font-extrabold text-gray-900">
                Reliable. Affordable. Nearby.
              </span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 py-4">
              {[
                ["1000+", "Skilled Workers"],
                ["500+", "Jobs Posted"],
                ["5+", "Counties Served"],
              ].map(([stat, label], i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-yellow-700">
                    {stat}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/job-posting" passHref>
                <div className="group relative px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-semibold text-base transition hover:from-yellow-700 hover:to-orange-700 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>Post a Job</span>
                  </div>
                </div>
              </Link>
              <Link href="/jobs" passHref>
                <div className="group px-6 py-3 bg-white text-yellow-800 border border-yellow-300 rounded-xl font-semibold text-base transition hover:border-yellow-600 hover:text-yellow-700 hover:shadow-md transform hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span>Job Listings</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Trust */}
            <div className="flex items-center space-x-4 pt-6 border-t border-yellow-200 mt-6">
              <div className="flex -space-x-2">
                {["👨‍🔧", "👷‍♀️", "🔨"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-yellow-200 rounded-full border-2 border-white flex items-center justify-center text-sm"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-700 font-medium">
                Trusted by 1000+ professionals
              </span>
            </div>
          </div>

          {/* Right - Image */}
          <div
            className={`relative transition-all duration-1000 ease-out delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative mx-auto rounded-3xl shadow-2xl overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-yellow-600 to-orange-600 rounded-3xl transform rotate-3 opacity-15" />
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-br from-gray-600 to-yellow-600 rounded-3xl transform -rotate-2 opacity-15" />

              <div className="relative">
                <Image
                  src="/images/workers.jpg"
                  alt="Construction workers using MJENGO Connect"
                  width={700}
                  height={400}
                  className="object-cover transition-transform duration-700 hover:scale-105 rounded-3xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl" />

                {/* Rating card */}
                <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-64 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-yellow-700"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        4.9/5 Rating
                      </div>
                      <div className="text-sm text-gray-600">
                        From 500+ satisfied customers
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-gray-600 to-yellow-600 rounded-full shadow-lg animate-pulse hidden md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
