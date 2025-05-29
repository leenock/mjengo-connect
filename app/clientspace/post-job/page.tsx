"use client";
import { useState } from "react";
import Sidebar from "@/components/job_posting/Sidebar";
import {
  BarChart3,
  Users,
  Briefcase,
  TrendingUp,
  Plus,
  Eye,
  MessageSquare,
  User,
  DollarSign,
  Clock,
  MapPin,
  Menu,
  ChartBarDecreasingIcon,
} from "lucide-react";

export default function PostJobPage() {
  const [isOpen, setIsOpen] = useState(false);

  const stats = [
    {
      title: "Active Jobs",
      value: "12",
      change: "+2 this week",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Jobs Posted",
      value: "156",
      change: "+23 this week",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Clicks",
      value: "34",
      change: "+5 this month",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Spent",
      value: "KSh 10000",
      change: "+12% this month",
      icon: ChartBarDecreasingIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const recentJobs = [
    {
      id: 1,
      title: "House Painting - 3 Bedroom",
      location: "Westlands, Nairobi",
      budget: "KSh 45,000 - 60,000",
      applications: 12,
      views: 156,
      status: "Active",
      postedTime: "2 hours ago",
      urgency: "Urgent",
    },
    {
      id: 2,
      title: "Plumbing Installation",
      location: "Karen, Nairobi",
      budget: "KSh 25,000 - 35,000",
      applications: 8,
      views: 89,
      status: "Active",
      postedTime: "1 day ago",
      urgency: "Normal",
    },
    {
      id: 3,
      title: "Electrical Wiring",
      location: "Industrial Area",
      budget: "KSh 120,000 - 180,000",
      applications: 15,
      views: 234,
      status: "In Progress",
      postedTime: "3 days ago",
      urgency: "Normal",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-6">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white mb-6 sm:mb-8 flex items-center justify-between px-4 sm:px-6 py-4">
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Welcome Doe
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Welcome back! Here is what is happening with your Job
                  Listings.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.title}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                          {stat.title}
                        </p>
                        <p className="text-lg sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                          {stat.value}
                        </p>
                        <p className="text-xs sm:text-sm text-green-600 mt-1 truncate">
                          {stat.change}
                        </p>
                      </div>
                      <div
                        className={`w-8 h-8 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2`}
                      >
                        <Icon
                          className={`w-4 h-4 sm:w-6 sm:h-6 ${stat.color}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-8">
              {/* Recent Jobs */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 space-y-2 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      Recent Job Postings
                    </h2>
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
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {job.title}
                            </h3>
                            {job.urgency === "Urgent" && (
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                Urgent
                              </span>
                            )}
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                job.status === "Active"
                                  ? "bg-green-100 text-green-600"
                                  : job.status === "In Progress"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {job.status}
                            </span>
                          </div>
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
                            {job.applications}
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
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <button className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    <Plus className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-xs sm:text-sm">Post New Job</span>
                  </button>
                  <button className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-xs sm:text-sm">View Messages</span>
                  </button>
                  <button className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-xs sm:text-sm">View Analytics</span>
                  </button>
                  <button className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-xs sm:text-sm">User Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
