"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Settings,
  User,
  LogOut,
  X,
  Building2,
  Calendar,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "My Jobs",
      href: "/clientspace/job-listings",
      icon: Briefcase,

      highlight: true,
    },

    {
      name: "Saved Jobs",
      href: "/employer/saved_jobs",
      icon: Calendar,
      badge: "3",
    },
    {
      name: "Subscriptions",
      href: "/employer/subscriptions",
      icon: Briefcase,
    },
    {
      name: "User Profile",
      href: "/employer/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-72`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">MJENGO</h2>
                <p className="text-xs text-gray-500">Fundi Portal</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">My Fundi</p>
                <p className="text-sm text-gray-500">Connecting workers</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <nav className="px-6 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                        : item.highlight
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-5 h-5 ${
                          active || item.highlight
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          active || item.highlight ? "text-white" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
              <LogOut className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
