"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Modern navbar with solid white background + scroll blur effect
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to toggle blurred background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
      ${scrolled 
        ? "bg-white/85 backdrop-blur-lg shadow-md"   // after scroll
        : "bg-white shadow-sm"                       // default solid white
      }
    `}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Left side brand */}
        <Link href="/" className="text-2xl font-bold tracking-wide text-gray-900">
          SmartMobility
        </Link>

        {/* Menu items */}
        <div className="flex gap-10 text-lg font-medium text-gray-800">
          <NavItem href="/">Home</NavItem>
          <NavItem href="/ice">ICE TCO</NavItem>
          <NavItem href="/bev">BEV TCO</NavItem>
          <NavItem href="/bev-ad">BEV-AD TCO</NavItem>
          <NavItem href="/comparison">Comparison</NavItem>
        </div>
      </nav>
    </header>
  );
}

// Individual nav item + hover underline
function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="hover:text-blue-600 transition-colors relative group"
    >
      {children}

      {/* Animated underline */}
      <span
        className="
          absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600
          group-hover:w-full transition-all duration-300
        "
      />
    </Link>
  );
}
