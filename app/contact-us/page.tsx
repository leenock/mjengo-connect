"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  User,
  MessageSquare,
} from "lucide-react";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";

export default function ContactUsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sectionElement = sectionRef.current; // ✅ Save ref value

    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionElement);

    return () => {
      observer.unobserve(sectionElement); // ✅ Use saved ref
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+254 xxx xxx xxx", "+254 xxx xxx xxx"],
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["info@mjengoconnect.com", "support@mjengoconnect.com"],
      color: "from-green-500 to-green-600",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office",
      details: ["Nairobi, Kenya", "Westlands, ABC Place"],
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Hours",
      details: ["Mon - Fri: 8AM - 6PM", "Sat: 9AM - 4PM"],
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact <span className="text-orange-600">Us</span>
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mx-auto mb-6" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with our team. We are here to help with you and
              answer any questions.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center transition-all duration-700 hover:shadow-xl hover:-translate-y-2 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4`}
                  >
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {info.title}
                  </h3>
                  <div className="space-y-1">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section ref={sectionRef} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Form */}
              <div
                className={`transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
              >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Send us a Message
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and we all get back to you within
                      24 hours.
                    </p>
                  </div>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600">
                        Thank you for contacting us. We all be in touch soon.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                              placeholder="Your full name"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                              placeholder="+254 700 123 456"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Subject *
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          >
                            <option value="">Select a subject</option>
                            <option value="general">General Inquiry</option>
                            <option value="services">
                              Services Information
                            </option>
                            <option value="support">Technical Support</option>
                            <option value="partnership">Partnership</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Message *
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={5}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                            placeholder="Tell us about your project or question..."
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            Send Message
                            <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </span>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div
                className={`transition-all duration-1000 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }`}
              >
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Get in Touch
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      We are building more than just a platform ,  Whether you
                      seeking reliable workmanship, a skilled fundi, or someone who shares our vision for a
                      more connected and empowered industry, we would love to hear
                      from you.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border border-orange-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Quick Response
                    </h3>
                    <p className="text-gray-600 mb-4">
                      We typically respond to all inquiries within 24 hours
                      during business days.
                    </p>
                    <div className="flex items-center text-orange-600">
                      <Clock className="w-5 h-5 mr-2" />
                      <span className="font-medium">
                        Average response time: 2-4 hours
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Emergency Support
                    </h3>
                    <p className="text-gray-600 mb-4">
                      For urgent construction emergencies, call our 24/7
                      hotline:
                    </p>
                    <div className="flex items-center text-red-600 font-bold text-lg">
                      <Phone className="w-5 h-5 mr-2" />
                      <span>+254 700 EMERGENCY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
