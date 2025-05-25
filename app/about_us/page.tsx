"use client";

import { useState, useEffect, useRef } from "react";
import { Lightbulb, Heart, Users } from "lucide-react";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";
import Image from "next/image";

export default function AboutUs() {
  const [storyVisible, setStoryVisible] = useState(false);
  const [valuesVisible, setValuesVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  const storyRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === storyRef.current) setStoryVisible(true);
            if (entry.target === valuesRef.current) setValuesVisible(true);
            if (entry.target === ctaRef.current) setCtaVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = [storyRef, valuesRef, ctaRef];
    sections.forEach((ref) => ref.current && observer.observe(ref.current));

    return () => {
      sections.forEach((ref) => ref.current && observer.unobserve(ref.current));
    };
  }, []);

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community First",
      description:
        "Building strong relationships between skilled workers and clients across Kenya.",
      color: "from-red-500 to-pink-600",
      bgColor: "from-red-50 to-pink-100",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Accessibility",
      description:
        "Making construction services available to everyone, everywhere in Kenya.",
      color: "from-yellow-500 to-orange-600",
      bgColor: "from-yellow-50 to-orange-100",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Growth & Impact",
      description:
        "Creating economic opportunities and driving industry transformation.",
      color: "from-green-500 to-teal-600",
      bgColor: "from-green-50 to-teal-100",
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-20 text-gray-900">
        {/* Our Story Section */}

        <section ref={storyRef} className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
            <div
              className={`text-center mb-20 transition-all duration-1000 ${
                storyVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Our Story
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Born from a simple observation: Kenya has incredible skilled
                workers, but connecting them with those who need their services
                was unnecessarily complicated. We set out to change that.
              </p>
            </div>

            {/* Grid Layout with Text + Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Text Content */}
              <div
                className={`transition-all duration-1000 delay-200 ${
                  storyVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                <h3 className="text-3xl font-bold mb-4">
                  Empowering Skilled Fundis, Connecting Them to Opportunity
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Across Kenya, countless skilled fundis remain unseen — not
                  because they lack talent, but because they lack visibility.
                  Without a platform to showcase their work, many struggle to
                  find consistent jobs or grow their craft into a sustainable
                  business.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Meanwhile, clients seeking reliable construction services
                  often rely on word-of-mouth or guesswork, with no easy way to
                  verify skills, compare prices, or ensure quality.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We built this platform to solve both problems. By connecting
                  trusted fundis with people who need them, we’re unlocking
                  opportunity, restoring trust, and raising the standard of
                  construction across the country.
                </p>
              </div>

              {/* Right Column - Image Placeholder */}
              <div
                className={`transition-all duration-1000 delay-300 ${
                  storyVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-8"
                }`}
              >
                <Image
                  src="/images/workers1.jpg"
                  alt="Our Story"
                  width={600}
                  height={400}
                  className="rounded-xl object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section
          ref={valuesRef}
          className="py-24 bg-gradient-to-br from-gray-50 to-white"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                valuesVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Our Core Values
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                These values guide everything we do, from how we build our
                platform to how we serve our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`group relative transition-all duration-1000 transform hover:scale-105 ${
                    valuesVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${value.bgColor} opacity-30 group-hover:opacity-40 transition-opacity rounded-2xl`}
                  />
                  <div className="relative p-8 bg-white border border-gray-100 rounded-2xl shadow-md group-hover:shadow-xl z-10">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${value.color} text-white flex items-center justify-center rounded-xl mb-5`}
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-700">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section
          ref={ctaRef}
          className="py-24 bg-gradient-to-r from-orange-500 to-yellow-500"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 text-center text-white">
            <div
              className={`transition-all duration-1000 ${
                ctaVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Let’s Build Our Community Together
              </h2>
              <p className="mb-8 text-white/90 max-w-2xl mx-auto">
                Whether you are looking for skilled professionals or want to
                grow your construction business — MJENGO Connect is your trusted
                partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold hover:shadow-xl transition-transform hover:-translate-y-1">
                  Post a Job
                </button>
                <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-transform hover:-translate-y-1">
                  Job Listings
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
