"use client";

import type React from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  EyeOff,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Calendar,
  Shield,
  CheckCircle,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";
import Link from "next/link";

interface JobDetailsPageProps {
  jobId: string;
}

export default function JobDetailsPage({ jobId }: JobDetailsPageProps) {
  // Mock job listings data - in real app, this would be fetched from API
  const jobListings = [
    {
      id: 1,
      title: "House Painting - 3 Bedroom Villa",
      category: "painting",
      location: "Westlands, Nairobi",
      budget: "KSh 45,000 - 60,000",
      skills: [
        "Interior Painting",
        "Exterior Painting",
        "Color Consultation",
        "Surface Preparation",
      ],
      postedTime: "2 hours ago",
      urgency: "Urgent",
      rating: 4.8,
      description:
        "Need experienced painter for 3-bedroom villa interior and exterior painting. Must have own equipment and provide color consultation.",
      projectDuration: "1-2 weeks",
      verified: true,
      applicants: 12,
      views: 156,
      detailedDescription: `We are looking for a skilled and experienced painter to handle the complete painting of our 3-bedroom villa in Westlands. This is a comprehensive project that includes both interior and exterior work.

**Project Scope:**
- Interior painting of all 3 bedrooms
- Living room, dining room, and kitchen areas
- 2 bathrooms and guest toilet
- All hallways and corridors
- Exterior walls and trim work
- Window frames and door painting

**Property Details:**
- Modern villa with high ceilings (12 feet)
- Total area: approximately 2,500 sq ft
- Good access for equipment and materials
- Secure parking available on-site

**Timeline:**
The project needs to be completed within 1-2 weeks as we have tenants moving in. We're looking for someone who can start immediately and work efficiently while maintaining high quality standards.`,
      requirements: [
        "Minimum 5 years of professional painting experience",
        "Own professional painting equipment and tools",
        "Portfolio of previous residential projects",
        "Ability to provide color consultation and recommendations",
        "Knowledge of different paint types and finishes",
        "Reliable and punctual work ethic",
      ],
      additionalRequirements: [
        "Must have liability insurance coverage",
        "Provide 3 recent client references",
        "Available to start within 3 days",
        "Quality guarantee for minimum 2 years",
        "Complete cleanup after project completion",
        "Professional appearance and conduct",
      ],
      contact: {
        name: "John Kamau",
        phone: "+254 712 345 678",
        email: "john.kamau@email.com",
        company: "Kamau Properties Ltd",
      },
      clientRating: 4.9,
      clientReviews: 23,
      paymentTerms: "50% upfront, 50% on completion",
      materialsProvided: true,
    },
    {
      id: 2,
      title: "Plumbing Installation - New Apartment",
      category: "plumbing",
      location: "Karen, Nairobi",
      budget: "KSh 25,000 - 35,000",
      skills: [
        "Pipe Installation",
        "Fixture Setup",
        "Water Systems",
        "Leak Detection",
      ],
      postedTime: "4 hours ago",
      urgency: "Normal",
      rating: 4.9,
      description:
        "Complete plumbing installation for new 2-bedroom apartment including kitchen and bathroom fixtures.",
      projectDuration: "3-5 days",
      verified: true,
      applicants: 8,
      views: 89,
      detailedDescription: `We need a skilled plumber for a complete plumbing installation in our new 2-bedroom apartment in Karen. This is a new construction project requiring professional plumbing work.

**Project Scope:**
- Kitchen plumbing installation
- 2 bathroom complete plumbing
- Hot water system installation
- Drainage system setup
- Fixture installation and testing

**Property Details:**
- New 2-bedroom apartment
- Modern fixtures provided
- Easy access for installation
- All materials included

**Requirements:**
We need someone who can work efficiently and complete the project within the specified timeframe while maintaining high quality standards.`,
      requirements: [
        "Licensed plumber with 3+ years experience",
        "Experience with modern plumbing systems",
        "Own professional tools and equipment",
        "Knowledge of local plumbing codes",
        "Ability to work with provided fixtures",
        "Clean and professional work habits",
      ],
      additionalRequirements: [
        "Must provide plumbing license",
        "Insurance coverage required",
        "Available to start within 1 week",
        "Warranty on all work performed",
        "Complete system testing",
        "Professional references required",
      ],
      contact: {
        name: "Mary Wanjiku",
        phone: "+254 723 456 789",
        email: "mary.wanjiku@email.com",
        company: "Wanjiku Developments",
      },
      clientRating: 4.7,
      clientReviews: 15,
      paymentTerms: "40% upfront, 60% on completion",
      materialsProvided: true,
    },
    {
      id: 3,
      title: "Electrical Wiring - Commercial Building",
      category: "electrical",
      location: "Industrial Area, Nairobi",
      budget: "KSh 120,000 - 180,000",
      skills: [
        "Commercial Wiring",
        "Panel Installation",
        "Safety Systems",
        "Code Compliance",
      ],
      postedTime: "6 hours ago",
      urgency: "Normal",
      rating: 4.7,
      description:
        "Complete electrical wiring for 3-story commercial building. Must comply with all safety standards and regulations.",
      projectDuration: "3-4 weeks",
      verified: true,
      applicants: 15,
      views: 234,
      detailedDescription: `We are seeking a qualified electrical contractor for the complete electrical installation of our new 3-story commercial building in Industrial Area.

**Project Scope:**
- Complete electrical wiring for 3 floors
- Main electrical panel installation
- Distribution panels for each floor
- Lighting system installation
- Power outlets and switches
- Emergency lighting system
- Fire alarm system wiring

**Building Details:**
- 3-story commercial building
- Total area: 5,000 sq ft
- Modern office spaces
- Retail space on ground floor
- Parking area lighting

**Compliance:**
All work must comply with Kenya Bureau of Standards electrical codes and local authority requirements.`,
      requirements: [
        "Licensed electrical contractor",
        "Minimum 7 years commercial experience",
        "Knowledge of commercial electrical codes",
        "Experience with 3-phase systems",
        "Own professional equipment",
        "Team of qualified electricians",
      ],
      additionalRequirements: [
        "Valid electrical contractor license",
        "Comprehensive insurance coverage",
        "Safety certification required",
        "Available for 3-4 week project",
        "Quality assurance documentation",
        "Post-installation support",
      ],
      contact: {
        name: "Peter Mwangi",
        phone: "+254 734 567 890",
        email: "peter.mwangi@email.com",
        company: "Mwangi Construction Ltd",
      },
      clientRating: 4.8,
      clientReviews: 31,
      paymentTerms: "30% upfront, 40% at midpoint, 30% on completion",
      materialsProvided: false,
    },
  ];

  // Find the specific job based on jobId
  const jobData = jobListings.find((job) => job.id === Number.parseInt(jobId));

  // If job not found, show error state
  if (!jobData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Job Not Found
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The job you are looking for doesnt exist or has been removed. It
              may have been filled or expired.
            </p>
            <div className="space-y-3">
              <Link href="/jobs">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Browse All Jobs
                </button>
              </Link>
              <Link href="/">
                <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300">
                  Go to Homepage
                </button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link
                href="/Jobs-list"
                className="hover:text-orange-600 transition-colors"
              >
                Construction Jobs
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{jobData.title}</span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Back Button */}
              <Link href="/Jobs-list">
                <button className="flex items-center text-gray-600 hover:text-orange-600 transition-colors mb-6 py-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Back to Job Listings</span>
                </button>
              </Link>

              {/* Job Header */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mr-2">
                        {jobData.title}
                      </h1>
                      {jobData.verified && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <Shield className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      {jobData.urgency === "Urgent" && (
                        <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                          🔥 Urgent
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600 text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        <span>{jobData.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        <span>Posted {jobData.postedTime}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        <span>Duration: {jobData.projectDuration}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        <span>
                          {jobData.category.charAt(0).toUpperCase() +
                            jobData.category.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left md:text-right bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
                    <div className="flex items-center md:justify-end text-green-600 font-bold text-xl mb-2">
                      <DollarSign className="w-5 h-5 mr-1" />
                      <span>{jobData.budget}</span>
                    </div>
                    <div className="flex items-center md:justify-end text-yellow-500 mb-2">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="text-gray-600 font-medium">
                        {jobData.rating}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {jobData.applicants} applicants • {jobData.views} views
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Project Description
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {jobData.description}
                  </p>
                  <div className="whitespace-pre-line text-gray-600 leading-relaxed">
                    {jobData.detailedDescription}
                  </div>
                </div>
              </div>

              {/* Skills Required */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Skills Required
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {jobData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-orange-100 text-orange-600 text-xs sm:text-sm font-medium rounded-full border border-orange-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Requirements
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                      Basic Requirements
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {jobData.requirements.map((req, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Additional Requirements
                    </h3>
                    <div className="space-y-3">
                      {jobData.additionalRequirements.map((req, index) => (
                        <div key={index} className="flex items-start">
                          <AlertCircle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Project Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Payment Terms
                      </h4>
                      <p className="text-gray-600">{jobData.paymentTerms}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Materials
                      </h4>
                      <p className="text-gray-600">
                        {jobData.materialsProvided
                          ? "Materials provided by client"
                          : "Contractor provides materials"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Project Category
                      </h4>
                      <p className="text-gray-600 capitalize">
                        {jobData.category}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Urgency Level
                      </h4>
                      <p className="text-gray-600">{jobData.urgency}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-6">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Client Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <User className="w-5 h-5 mr-3 text-orange-500" />
                    <div>
                      <p className="font-medium">{jobData.contact.name}</p>
                      <p className="text-sm text-gray-500">
                        {jobData.contact.company}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-5 h-5 mr-3 text-orange-500" />
                        <a
                          href={`tel:${jobData.contact.phone}`}
                          className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                          {jobData.contact.phone}
                        </a>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Mail className="w-5 h-5 mr-3 text-orange-500" />
                        <a
                          href={`mailto:${jobData.contact.email}`}
                          className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                          {jobData.contact.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <button className="w-full px-6 py-3 border-2 border-orange-500 text-orange-600 rounded-xl font-semibold transition-all duration-300 hover:bg-orange-50">
                      Share Job
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-orange-50 rounded-lg p-6 mb-4 border border-orange-100">
                    <EyeOff className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-900 mb-2">
                      Sign In to View Contact Details
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Create an account or sign in to view client contact
                      information and contact employer for this job.
                    </p>
                  </div>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    Sign In to View Contact
                  </button>
                </div>
              </div>

              {/* Job Statistics */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Job Statistics
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center"></div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-orange-500 mr-2" />
                      <span className="text-gray-600">Posted</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {jobData.postedTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-600">Status</span>
                    </div>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
