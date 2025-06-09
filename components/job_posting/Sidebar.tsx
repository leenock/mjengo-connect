"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Briefcase,
  Settings,
  BarChart3,
  User,
  LogOut,
  X,
  Building2,
  Star,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/clientspace/post-job",
      icon: LayoutDashboard,
      description: "Overview & statistics",
    },
    {
      name: "Post New Job",
      href: "/clientspace/newJob",
      icon: Plus,
      highlight: true,
      description: "Create a new listing",
    },
    {
      name: "My Jobs",
      href: "/clientspace/myJobs",
      icon: Briefcase,
      badge: "12",
      description: "Manage your listings",
    },

    {
      name: "Analytics",
      href: "/clientspace/post-job",
      icon: BarChart3,
      description: "Performance insights",
    },
    {
      name: "User Profile",
      href: "/clientspace/userProfile",
      icon: Settings,
      description: "Account settings",
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-white via-slate-50 to-indigo-50 border-r border-white/20 shadow-2xl z-50 transition-all duration-500 ease-out lg:sticky lg:top-0 lg:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-80`}
      >
        <div className="flex flex-col h-full backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/30 bg-white/40 backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  MJENGO
                </h2>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                  Client Portal
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/60 transition-all duration-200 shadow-sm"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-white/30 bg-white/20 backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-900 text-lg">John Kamau</p>
                <p className="text-sm font-bold text-slate-600 mb-2">
                  Kamau Properties Ltd
                </p>
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 text-amber-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-600 ml-1">
                    4.9
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            <nav className="px-6 space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                      active
                        ? "bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white shadow-xl shadow-orange-500/25"
                        : item.highlight
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20"
                        : "text-slate-700 hover:bg-white/60 hover:shadow-lg backdrop-blur-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          active || item.highlight
                            ? "bg-white/20"
                            : "bg-slate-100 group-hover:bg-white/80"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            active || item.highlight
                              ? "text-white"
                              : "text-slate-600 group-hover:text-slate-700"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <span
                          className={`font-bold text-base block ${
                            active || item.highlight
                              ? "text-white"
                              : "text-slate-900"
                          }`}
                        >
                          {item.name}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            active || item.highlight
                              ? "text-white/80"
                              : "text-slate-500 group-hover:text-slate-600"
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </div>
                    {item.badge && (
                      <div
                        className={`px-3 py-1 text-xs font-black rounded-full ${
                          active
                            ? "bg-white/30 text-white"
                            : "bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 shadow-sm"
                        }`}
                      >
                        {item.badge}
                      </div>
                    )}

                    {/* Active indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mx-6 mt-8 p-4 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
              <h4 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">
                Account Stats
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">
                    Active Jobs
                  </span>
                  <span className="text-sm font-black text-slate-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">
                    Applications
                  </span>
                  <span className="text-sm font-black text-emerald-600">
                    +28
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">
                    Rating
                  </span>
                  <span className="text-sm font-black text-amber-600">
                    4.9★
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/30 bg-white/20 backdrop-blur-xl flex-shrink-0">
            <button className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-slate-700 hover:bg-white/60 transition-all duration-200 group hover:shadow-lg">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <LogOut className="w-5 h-5 text-slate-600 group-hover:text-red-600 transition-colors" />
              </div>
              <div className="flex-1 text-left">
                <span className="font-bold text-slate-900 block">Sign Out</span>
                <span className="text-xs font-medium text-slate-500">
                  End your session
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
