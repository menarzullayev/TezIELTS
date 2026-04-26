"use client";

import Link from "next/link";
import { useUI } from "@/store/useUI";
import { BookOpen, UserCircle2 } from "lucide-react";

export default function Navbar() {
  const { openAuthModal } = useUI();

  return (
    <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                T
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                TezIELTS
              </span>
            </Link>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link 
              href="/tests" 
              className="flex items-center gap-2 hover:text-orange-600 transition-colors py-2"
              prefetch={true}
            >
              <BookOpen className="w-4 h-4" />
              Katalog
            </Link>
            <Link href="#pricing" className="hover:text-orange-600 transition-colors py-2">
              Tariflar
            </Link>
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-4">
            <button 
              onClick={openAuthModal}
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors"
            >
              <UserCircle2 className="w-5 h-5" />
              Kirish
            </button>
            <Link 
              href="/tests" 
              className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all"
              prefetch={true}
            >
              Start for Free
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
