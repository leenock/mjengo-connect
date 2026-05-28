"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronUp, Facebook, Instagram, Twitter } from "lucide-react";

const footerLinks = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about_us" },
      { label: "Contact", href: "/contact-us" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Browse jobs", href: "/Jobs-list" },
      { label: "Post a job", href: "/auth/job-posting" },
      { label: "Fundi login", href: "/auth/job-listing" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/">
              <Image
                src="/images/logo5.png"
                alt="MJENGO Connect"
                width={180}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Connecting skilled fundis with construction opportunities across Kenya. A professional marketplace for hiring and finding work.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-4">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
                  {section.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
              Mobile app
            </h4>
            <p className="mt-4 text-sm text-slate-400">Coming soon on Google Play.</p>
            <Link href="/coming-soon" className="mt-4 inline-block">
              <Image
                src="/images/playstore5.png"
                alt="Get it on Google Play"
                width={140}
                height={42}
                className="rounded opacity-90"
              />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} MJENGO Connect. All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            Back to top
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
