"use client";
import { useState, useEffect } from "react";
import type React from "react";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";

import {
  Smartphone,
  Download,
  Bell,
  CheckCircle,
  Star,
  Users,
  Zap,
  Apple,
  PlayCircle,
} from "lucide-react";

export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer - set to 30 days from now
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 300);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Instant Job Alerts",
      description:
        "Get notified immediately when jobs matching your skills are posted in your area",
    },
    {
      icon: Users,
      title: "Direct Communication",
      description:
        "Chat directly with employers and clients through our secure messaging system",
    },
    {
      icon: Star,
      title: "Portfolio Showcase",
      description:
        "Build your professional profile with photos of your work and client reviews",
    },
    {
      icon: CheckCircle,
      title: "Verified Jobs",
      description:
        "All jobs are verified and payments are secured through our platform",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Registered Fundis" },
    { number: "5,000+", label: "Jobs Posted" },
    { number: "98%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}

      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6">
                <Bell className="w-4 h-4 mr-2" />
                Coming Soon
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                MJENGO CONNECT Mobile App
                <span className="block text-orange-600">Coming Soon!</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Take your construction business mobile! Find jobs, connect with
                clients, and manage your projects on the go with our powerful
                mobile app.
              </p>

              {/* Countdown Timer */}
              <div className="grid grid-cols-4 gap-4 mb-8 max-w-md mx-auto lg:mx-0">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                      {item.value}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Download Buttons Preview */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <div className="flex items-center px-6 py-3 bg-black text-white rounded-xl font-medium opacity-50 cursor-not-allowed">
                  <Apple className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </div>
                <div className="flex items-center px-6 py-3 bg-black text-white rounded-xl font-medium opacity-50 cursor-not-allowed">
                  <PlayCircle className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Be the first to download when we launch!
              </p>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative">
              <div className="relative mx-auto w-80 h-96 lg:w-96 lg:h-[500px]">
                {/* Phone Frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl">
                  {/* Screen */}
                  <div className="absolute inset-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="h-8 bg-black/20 flex items-center justify-between px-6 text-white text-xs">
                      <span>9:41</span>
                      <span>●●●</span>
                    </div>

                    {/* App Content Preview */}
                    <div className="p-6 text-white">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Smartphone className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold">MJENGO</h3>
                        <p className="text-white/80 text-sm">
                          Find Your Next Job
                        </p>
                      </div>

                      {/* Mock Job Cards */}
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                          <div className="text-sm font-medium">
                            House Painting
                          </div>
                          <div className="text-xs text-white/70">
                            Westlands • KSh 45,000
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                          <div className="text-sm font-medium">
                            Plumbing Repair
                          </div>
                          <div className="text-xs text-white/70">
                            Karen • KSh 25,000
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                          <div className="text-sm font-medium">
                            Electrical Work
                          </div>
                          <div className="text-xs text-white/70">
                            Kiambu • KSh 80,000
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Bell className="w-8 h-8 text-yellow-800" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Download className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features Coming to Your Phone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to grow your construction business, now in
              your pocket
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
