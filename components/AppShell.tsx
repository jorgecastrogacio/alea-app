"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import {
  Home,
  Compass,
  BookMarked,
  Trophy,
  Sparkles,
  ChevronDown,
  Search,
  Bell,
  BookOpen,
} from "lucide-react";
import BottomNav from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isOnboarding = pathname?.startsWith("/onboarding");
  const store = useOnboardingStore();
  const [userName, setUserName] = useState<string>("Lector");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("alea_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nickname) {
          setUserName(parsed.nickname);
          return;
        }
      }
      if (store.nickname) {
        setUserName(store.nickname);
      }
    } catch {
      // fallback
    }
  }, [store.nickname]);

  if (isOnboarding) {
    return (
      <main className="min-h-screen w-full flex justify-center bg-gradient-to-b from-[#E7EAFB] via-[#F4F4FD] to-[#ECEBFA]">
        <div className="w-full max-w-md min-h-screen flex flex-col relative shadow-2xl shadow-indigo-900/10 border-x border-indigo-100/50">
          {children}
        </div>
      </main>
    );
  }

  const navItems = [
    { name: "Inicio", href: "/descubre", icon: Home, pattern: /^\/(descubre|$)/ },
    { name: "Explorar", href: "/explora", icon: Compass, pattern: /^\/explora/ },
    { name: "Mi biblioteca", href: "/biblioteca", icon: BookMarked, pattern: /^\/biblioteca/ },
    { name: "Mis logros", href: "/universo", icon: Trophy, pattern: /^\/universo/ },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#EAEBF9] via-[#F4F5FD] to-[#E9EAF8] flex justify-center text-slate-800">
      {/* Container adapts: on tablet/desktop it gives the spacious dashboard feel; on mobile it centers smoothly */}
      <div className="w-full max-w-5xl min-h-screen flex flex-col md:flex-row relative bg-white/95 md:shadow-2xl md:shadow-indigo-900/10 md:my-4 md:rounded-3xl md:overflow-hidden md:border md:border-indigo-100/80">
        
        {/* DESKTOP/TABLET SIDEBAR (Exact design from user mockup media_1793997219619.jpg) */}
        <aside className="hidden md:flex flex-col justify-between w-52 bg-white/90 border-r border-indigo-100/70 p-5 shrink-0 z-30">
          <div>
            {/* Logo ALEA+ */}
            <Link href="/descubre" className="flex items-center gap-1.5 px-3 py-2 mb-6 group">
              <span className="text-2xl font-black tracking-tight text-[#30337E] group-hover:text-indigo-600 transition-colors">
                ALEA
              </span>
              <span className="text-indigo-500 font-bold text-lg mb-2">✦</span>
            </Link>

            {/* Navigation links */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = item.pattern.test(pathname || "/");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#ECEEFC] text-[#343788] font-bold shadow-sm"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.4 : 1.8}
                      className={isActive ? "text-[#474AB6]" : "text-slate-400"}
                    />
                    <span className="text-xs mt-1 tracking-tight">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom user profile in sidebar */}
          <Link
            href="/universo"
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-indigo-50/50 transition-colors group"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-indigo-200 shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <img
                src="/assets/avatar_daniela.jpg"
                alt={`Avatar de ${userName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#30337E]">
              <span>{userName}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </Link>
        </aside>

        {/* MAIN APP CONTENT */}
        <main className="flex-1 flex flex-col min-h-screen md:min-h-0 relative pb-20 md:pb-6 overflow-y-auto bg-[#F9FAFF]/60">
          {children}
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
