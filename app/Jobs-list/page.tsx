"use client";

import { useState } from "react";
import {
  MapPin,
  Clock,
  Briefcase,
  Search,
  Shield,
  Calendar,
  ChevronDown,
} from "lucide-react";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";
import Link from "next/link";

export default function JobsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "masonry", label: "Masonry" },
    { id: "painting", label: "Painting" },
    { id: "plumbing", label: "Plumbing" },
    { id: "electrical", label: "Electrical" },
    { id: "carpentry", label: "Carpentry" },
    { id: "roofing", label: "Roofing" },
    { id: "tiling", label: "Tiling" },
    { id: "welding", label: "Welding" },
  ];

  const locations = [
    { id: "all", label: "All Locations" },
    { id: "nairobi", label: "Nairobi" },
    { id: "mombasa", label: "Mombasa" },
    { id: "kisumu", label: "Kisumu" },
    { id: "nakuru", label: "Nakuru" },
    { id: "eldoret", label: "Eldoret" },
    { id: "thika", label: "Thika" },
    { id: "machakos", label: "Machakos" },
    { id: "meru", label: "Meru" },
  ];

  const jobListings = [
    {
      id: 1,
      title: "House Painting - 3 Bedroom Villa",
      category: "painting",
      location: "Westlands, Nairobi",
      StartDate: "2025-01-15",
      budget: "KSh 800/Day",
      skills: ["Interior Painting", "Exterior Painting", "Color Consultation"],
      postedTime: "2 hours ago",
      urgency: "Urgent",
      description:
        "Need experienced painter for 3-bedroom villa interior and exterior painting. Must have own equipment and provide color consultation.",
      projectDuration: "1-2 weeks",
      verified: true,
    },
    {
      id: 2,
      title: "Plumbing Installation - New Apartment",
      category: "plumbing",
      location: "Karen, Nairobi",
      StartDate: "2025-01-15",
      budget: "KSh 800/Day",
      skills: ["Pipe Installation", "Fixture Setup", "Water Systems"],
      postedTime: "4 hours ago",
      urgency: "Normal",
      description:
        "Complete plumbing installation for new 2-bedroom apartment including kitchen and bathroom fixtures.",
      projectDuration: "3-5 days",
      verified: true,
    },
    {
      id: 3,
      title: "Electrical Wiring - Commercial Building",
      category: "electrical",
      location: "Industrial Area, Nairobi",
      StartDate: "2025-01-15",
      budget: "KSh 800/Day",
      skills: ["Commercial Wiring", "Panel Installation", "Safety Systems"],
      postedTime: "6 hours ago",
      urgency: "Normal",
      description:
        "Complete electrical wiring for 3-story commercial building. Must comply with all safety standards and regulations.",
      projectDuration: "3-4 weeks",
      verified: true,
    },
  ];

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || job.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Find Your Next{" "}
                <span className="text-orange-600">Construction Project</span>
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mx-auto mb-6" />
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Browse verified construction jobs across Kenya. Connect with
                clients and grow your fundi business with quality projects.
              </p>
            </div>
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              {/* Main Search Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for construction jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white"
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Job Listings */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Available Jobs Listings
                </h2>
                <p className="text-gray-600">
                  {filteredJobs.length} jobs found matching your criteria
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
                  <p className="text-orange-800 text-sm font-medium">
                    <Shield className="w-4 h-4 inline mr-2" />
                    All jobs verified
                  </p>
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm">
                  <option>Sort by: Latest</option>
                  <option>Sort by: Pay (High to Low)</option>
                  <option>Sort by: Pay (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
                >
                  {/* Job Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {job.title}
                      </h3>
                      {job.verified && (
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-green-600" />
                        </div>
                      )}
                    </div>
                    {job.urgency === "Urgent" && (
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full mb-3">
                        🔥 Urgent
                      </span>
                    )}
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Start Date: {job.StartDate}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        Posted {job.postedTime}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        {job.category.charAt(0).toUpperCase() +
                          job.category.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Brief Description */}
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-2">
                    {job.description}
                  </p>

                  {/* Top Skills (show only first 2) */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 2).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 2 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{job.skills.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/job-details/${job.id}`}
                    className="inline-block px-3 py-1 bg-black text-white text-xs font-medium rounded-full hover:bg-white hover:text-black transition"
                  >
                    View More Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
