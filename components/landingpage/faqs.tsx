"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Search,
  MessageCircle,
  HelpCircle,
  Users,
  Briefcase,
} from "lucide-react";

export default function FAQs() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = sectionRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const categories = [
    {
      id: "general",
      label: "General",
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      id: "clients",
      label: "For Clients",
      icon: <Briefcase className="w-5 h-5" />,
    },
    { id: "fundis", label: "For Fundis", icon: <Users className="w-5 h-5" /> },
  ];

  const faqItems = [
    // General FAQs
    {
      id: "what-is-mjengo",
      category: "general",
      question: "What is MJENGO Connect?",
      answer:
        "MJENGO Connect is a platform that helps people find local fundis (skilled workers) like masons, plumbers, painters, welders, and electricians.",
    },
    {
      id: "how-does-it-help",
      category: "general",
      question: "How does MJENGO Connect help me?",
      answer:
        "Whether you're looking for a skilled worker or you're a fundi seeking jobs, MJENGO Connect bridges the gap. Post a job and nearby qualified workers will reach out. If you're a fundi, discover job opportunities and get hired with ease.",
    },
    {
      id: "who-can-use",
      category: "general",
      question: "Who can use MJENGO Connect?",
      answer:
        "Anyone! Whether you are building a house or looking for work as a fundi, MJENGO Connect is for you.",
    },

    // For Clients / Job Posters
    {
      id: "how-to-post-job",
      category: "clients",
      question: "How do I post a job?",
      answer:
        "Just fill in job details like type of work, location, time, and budget. Then pay a small listing fee (like Ksh 300), and we will post your job.",
    },
    {
      id: "can-they-conatact-me",
      category: "clients",
      question: "How do they contact me for the job?",
      answer:
        "Once you post a job, fundis can see it and contact you directly through the provided contact information.",
    },

    // For Fundis / Workers
    {
      id: "how-to-see-jobs",
      category: "fundis",
      question: "How do I see jobs?",
      answer: "You can browse jobs by location or trade present on the site.",
    },
    {
      id: "how-to-apply",
      category: "fundis",
      question: "How do I apply for a job?",
      answer:
        "After you register, you get 7 days of free access to full job details. After that, you can subscribe for only Ksh 200 per month.",
    },
  ];

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = faqItems.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      ref={sectionRef}
      id="faqs-section"
      className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      </div>

      {/* Dot Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* Header Section */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full text-sm font-medium text-orange-800 mb-6">
            <MessageCircle className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-orange-800 to-gray-900 bg-clip-text text-transparent">
            Got Questions? We have Got Answers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about MJENGO Connect, our services,
            and how we are transforming construction in Kenya.
          </p>
        </div>

        {/* Search Bar */}
        <div
          className={`max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div
          className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            className={`px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
              activeCategory === "all"
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600"
            }`}
            onClick={() => setActiveCategory("all")}
          >
            <HelpCircle className="w-4 h-4" />
            <span>All Questions</span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                activeCategory === category.id
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`border-b border-gray-100 last:border-b-0 transition-all duration-300 ${
                    expandedItems[faq.id] ? "bg-orange-50" : "hover:bg-gray-50"
                  }`}
                >
                  <button
                    className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={expandedItems[faq.id]}
                  >
                    <div className="flex items-center">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors duration-300 ${
                          expandedItems[faq.id]
                            ? "bg-orange-500 text-white"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        Q
                      </span>
                      <span className="font-semibold text-lg text-gray-900">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                        expandedItems[faq.id]
                          ? "transform rotate-180 text-orange-500"
                          : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedItems[faq.id]
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-8 pb-6 pt-2 text-gray-600 leading-relaxed">
                      <span className="font-medium text-orange-600">A: </span>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-8 py-12 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldnot find any questions matching your search. Try
                  different keywords or browse all categories.
                </p>
                <button
                  className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium transition-all duration-300 hover:bg-orange-600"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                >
                  View all FAQs
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Still Have Questions */}
        <div
          className={`mt-16 text-center transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-10 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Still Have Questions?
              </h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Our team is here to help. Contact us for personalized assistance
                with any questions about our services, platform, or how we can
                help with your construction needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                  Contact Support
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold transition-all duration-300 hover:bg-white/10 transform hover:-translate-y-1">
                  Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
