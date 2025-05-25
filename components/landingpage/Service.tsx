"use client";

import { useState, useEffect, useRef } from "react";
import { Briefcase, Users } from "lucide-react";

export default function Service() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, []);

  const services = [
    {
      icon: <Briefcase className="w-10 h-10" />,
      title: "Post a Job",
      description:
        "Need a mason, plumber, or welder? Post your job with location and budget for just Ksh 300. Verified fundis nearby will see your listing and contact you directly.",
      color: "from-gray-800 to-black",
      delay: 0,
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Browse Jobs",
      description:
        "Are you a fundi looking for work? Browse listings by trade and location. Create a free account and get a 7-day full access trial.",
      color: "from-gray-900 to-gray-800", // dark but accessible
      delay: 100,
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Hire a Fundi",
      description:
        "Post your construction job and let qualified fundis reach out. They browse listings by trade and location, then contact you directly.",
      color: "from-gray-700 to-gray-900",
      delay: 100,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services-section"
      className="py-20 bg-white relative overflow-hidden"
      aria-label="How MJENGO Connect Works"
    >
      {/* Background Glow Effects */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply blur-2xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply blur-2xl" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-20 xl:px-28 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 tracking-tight leading-tight">
            How MJENGO Connect Works
          </h2>

          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-6" />
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our platform simplifies the construction process by connecting you
            with skilled professionals in just three easy steps.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${service.delay}ms` }}
            >
              <div className="p-8">
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} text-white flex items-center justify-center shadow-md`}
                  >
                    {service.icon}
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="h-px flex-1 bg-orange-200 ml-3"></div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">{service.description}</p>

              
              </div>
              
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-orange-300">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}
