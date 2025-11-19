"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Instagram, ChevronUp, ChevronDown } from "lucide-react"

export default function Footer() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setActiveSection((prev) => (prev === section ? null : section))
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const footerLinks = [
    {
      title: "Company",
      id: "company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Services",
      id: "services",
      links: [
        { label: "Job listing", href: "/auth/job-listing" },
        { label: "Post a Job", href: "/auth/job-posting" },
      ],
    },
    {
      title: "Resources",
      id: "resources",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "FAQs", href: "/faqs" },
      ],
    },
  ]

  const socialLinks = [
    {
      icon: <Facebook className="w-5 h-5" />,
      href: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      href: "https://instagram.com",
      label: "Instagram",
    },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Logo & Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <Image src="/images/logo5.png" alt="MJENGO Connect" width={180} height={60} className="h-12 w-auto" />
            </Link>

            <p className="text-gray-400 leading-relaxed max-w-sm">
              Connecting skilled fundis with construction services across Kenya. Building a better future, one project
              at a time.
            </p>

            {/* Social Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, i) => (
                  <Link
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* App Download */}
            <div>
              <h4 className="text-white font-semibold mb-4">Download Our App</h4>
              <Link href="#" className="inline-block hover:scale-105 transition-transform duration-300">
                <Image
                  src="/images/playstore5.png"
                  alt="Download on Google Play"
                  width={140}
                  height={42}
                  className="rounded-lg"
                />
              </Link>
            </div>
          </div>

          {/* Footer Links - Desktop */}
          <div className="hidden lg:grid lg:col-span-3 lg:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.id} className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link href={link.href} className="text-gray-400 text-sm">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Links - Mobile Accordion */}
          <div className="lg:hidden col-span-full space-y-2">
            {footerLinks.map((section) => (
              <div key={section.id} className="border border-gray-800 rounded-lg overflow-hidden">
                <button
                  className="flex items-center justify-between w-full text-left p-4 hover:bg-gray-800 transition-colors duration-300"
                  onClick={() => toggleSection(section.id)}
                >
                  <h4 className="text-lg font-semibold text-white">{section.title}</h4>
                  {activeSection === section.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeSection === section.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-4 pt-0 space-y-3 bg-gray-800/50">
                    {section.links.map((link, i) => (
                      <Link key={i} href={link.href} className="block py-2 text-gray-400 text-sm">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} MJENGO Connect. All rights reserved.
            </div>
           
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 z-20"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </footer>
  )
}
