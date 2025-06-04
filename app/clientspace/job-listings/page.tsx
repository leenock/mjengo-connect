"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/fundi/Sidebar"
import {
  Menu,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Users,
  Calendar,
  Briefcase,
  Search,
  Heart,
  Eye,
  CreditCard,
  Bookmark,
} from "lucide-react"

export default function JobListingsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const categories = ["All", "Plumbing", "Electrical", "Painting", "Construction", "Carpentry", "Roofing"]

  // Stats for Fundi dashboard
  const stats = [
    {
      title: "Active Jobs",
      value: "8",
      change: "+2 this week",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Saved Jobs",
      value: "24",
      change: "+5 this week",
      icon: Bookmark,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Subscription Spent",
      value: "KSh 2,500",
      change: "This month",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Next Payment",
      value: "12 days",
      change: "Premium plan",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  // Recent job postings (jobs available to apply)
  const recentJobs = [
    {
      id: 1,
      title: "House Painting - 3 Bedroom",
      company: "Kamau Properties Ltd",
      location: "Westlands, Nairobi",
      budget: "KSh 45,000 - 60,000",
      postedTime: "2 hours ago",
      urgency: "Urgent",
      applicants: 12,
      views: 156,
      status: "Available",
    },
    {
      id: 2,
      title: "Plumbing Installation",
      company: "Green Valley Estates",
      location: "Karen, Nairobi",
      budget: "KSh 25,000 - 35,000",
      postedTime: "1 day ago",
      urgency: "Normal",
      applicants: 8,
      views: 89,
      status: "Available",
    },
    {
      id: 3,
      title: "Electrical Wiring",
      company: "Metro Construction",
      location: "Industrial Area",
      budget: "KSh 120,000 - 180,000",
      postedTime: "3 days ago",
      urgency: "Normal",
      applicants: 15,
      views: 234,
      status: "Available",
    },
  ]

  // Recent saved applications (jobs the fundi has applied to)
  const recentApplications = [
    {
      id: 1,
      jobTitle: "Kitchen Cabinet Installation",
      company: "Modern Living Spaces",
      appliedTime: "2 hours ago",
      status: "Under Review",
      budget: "KSh 35,000 - 50,000",
    },
    {
      id: 2,
      jobTitle: "Roof Repair & Maintenance",
      company: "Sunshine Homes",
      appliedTime: "1 day ago",
      status: "Shortlisted",
      budget: "KSh 15,000 - 25,000",
    },
    {
      id: 3,
      jobTitle: "Foundation Construction",
      company: "BuildRight Contractors",
      appliedTime: "3 days ago",
      status: "Interview Scheduled",
      budget: "KSh 200,000 - 300,000",
    },
  ]

  const jobListings = [
    {
      id: 1,
      title: "House Painting - 3 Bedroom",
      company: "Kamau Properties Ltd",
      location: "Westlands, Nairobi",
      budget: "KSh 45,000 - 60,000",
      duration: "3-5 days",
      postedTime: "2 hours ago",
      urgency: "Urgent",
      category: "Painting",
      description:
        "Looking for experienced painters to paint a 3-bedroom house. Must have own equipment and materials will be provided.",
      requirements: ["3+ years experience", "Own painting equipment", "References required"],
      applicants: 12,
      views: 156,
      rating: 4.8,
      verified: true,
      saved: false,
    },
    {
      id: 2,
      title: "Plumbing Installation & Repair",
      company: "Green Valley Estates",
      location: "Karen, Nairobi",
      budget: "KSh 25,000 - 35,000",
      duration: "2-3 days",
      postedTime: "1 day ago",
      urgency: "Normal",
      category: "Plumbing",
      description: "Need a qualified plumber for bathroom renovation and pipe installation in a new apartment complex.",
      requirements: ["Licensed plumber", "5+ years experience", "Insurance coverage"],
      applicants: 8,
      views: 89,
      rating: 4.9,
      verified: true,
      saved: true,
    },
    {
      id: 3,
      title: "Electrical Wiring - Commercial Building",
      company: "Metro Construction",
      location: "Industrial Area, Nairobi",
      budget: "KSh 120,000 - 180,000",
      duration: "2-3 weeks",
      postedTime: "3 days ago",
      urgency: "Normal",
      category: "Electrical",
      description: "Complete electrical wiring for a 5-story commercial building. Must be certified electrician.",
      requirements: ["Certified electrician", "Commercial experience", "Team leadership skills"],
      applicants: 15,
      views: 234,
      rating: 4.7,
      verified: true,
      saved: false,
    },
    {
      id: 4,
      title: "Roof Repair & Maintenance",
      company: "Sunshine Homes",
      location: "Kiambu, Kiambu County",
      budget: "KSh 15,000 - 25,000",
      duration: "1-2 days",
      postedTime: "5 hours ago",
      urgency: "Urgent",
      category: "Roofing",
      description: "Emergency roof repair needed after storm damage. Must be available immediately.",
      requirements: ["Roofing experience", "Safety equipment", "Available immediately"],
      applicants: 6,
      views: 78,
      rating: 4.6,
      verified: false,
      saved: false,
    },
    {
      id: 5,
      title: "Kitchen Cabinet Installation",
      company: "Modern Living Spaces",
      location: "Runda, Nairobi",
      budget: "KSh 35,000 - 50,000",
      duration: "4-6 days",
      postedTime: "1 week ago",
      urgency: "Normal",
      category: "Carpentry",
      description: "Custom kitchen cabinet installation in luxury home. Precision and attention to detail required.",
      requirements: ["Cabinet installation experience", "Precision tools", "Portfolio of previous work"],
      applicants: 20,
      views: 312,
      rating: 4.9,
      verified: true,
      saved: true,
    },
    {
      id: 6,
      title: "Foundation Construction",
      company: "BuildRight Contractors",
      location: "Machakos, Machakos County",
      budget: "KSh 200,000 - 300,000",
      duration: "3-4 weeks",
      postedTime: "2 days ago",
      urgency: "Normal",
      category: "Construction",
      description: "Foundation construction for residential building. Experience with concrete work essential.",
      requirements: ["Foundation experience", "Concrete expertise", "Team management"],
      applicants: 11,
      views: 167,
      rating: 4.8,
      verified: true,
      saved: false,
    },
  ]

  const filteredJobs = jobListings.filter((job) => {
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleSaveJob = (jobId: number) => {
    console.log(`Toggle save for job ${jobId}`)
  }

  const viewJobDetails = (jobId: number) => {
    router.push(`./job/${jobId}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-6">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-gray-50 mb-6 sm:mb-8 flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Fundi</h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Welcome back! Here is what is happening with your job applications.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.title}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                        <p className="text-lg sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-green-600 mt-1 truncate">{stat.change}</p>
                      </div>
                      <div
                        className={`w-8 h-8 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2`}
                      >
                        <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              {/* Recent Job Postings */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 space-y-2 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Job Postings</h2>
                    <button className="px-3 py-2 sm:px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                    {recentJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors space-y-2 sm:space-y-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{job.title}</h3>
                            {job.urgency === "Urgent" && (
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                Urgent
                              </span>
                            )}
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                              {job.status}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">{job.company}</p>
                          <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 gap-2 sm:gap-4">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="truncate">{job.location}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="truncate">{job.budget}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              {job.postedTime}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-600 flex-shrink-0">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {job.applicants}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {job.views}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Saved Applications */}
              <div>
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Applications</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                    {recentApplications.map((application) => (
                      <div
                        key={application.id}
                        className="p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl hover:border-orange-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {application.jobTitle}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${
                              application.status === "Under Review"
                                ? "bg-yellow-100 text-yellow-600"
                                : application.status === "Shortlisted"
                                  ? "bg-blue-100 text-blue-600"
                                  : application.status === "Interview Scheduled"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {application.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">{application.company}</p>
                        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {application.budget}
                          </div>
                          <span>{application.appliedTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 mt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{job.title}</h3>
                          {job.verified && (
                            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                              Verified
                            </span>
                          )}
                          {job.urgency === "Urgent" && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 font-medium mb-2">{job.company}</p>
                        <p className="text-gray-600 text-sm mb-3">{job.description}</p>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${job.saved ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                      </button>
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>{job.budget}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{job.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{job.postedTime}</span>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{job.applicants} applicants</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{job.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                          <span>{job.rating}</span>
                        </div>
                      </div>

                      {/* View Job Button */}
                      <button
                        onClick={() => viewJobDetails(job.id)}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm sm:text-base"
                      >
                        View Job
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
