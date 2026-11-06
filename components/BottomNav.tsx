"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BookMarked, Trophy } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Hide Bottom Navigation during Onboarding to keep the user focused
  if (pathname?.startsWith("/onboarding")) {
    return null;
  }

  const navItems = [
    {
      name: "Inicio",
      href: "/descubre",
      icon: Home,
      activePattern: /^\/(descubre|$)/,
    },
    {
      name: "Explorar",
      href: "/explora",
      icon: Compass,
      activePattern: /^\/explora/,
    },
    {
      name: "Mi biblioteca",
      href: "/biblioteca",
      icon: BookMarked,
      activePattern: /^\/biblioteca/,
    },
    {
      name: "Mis logros",
      href: "/universo",
      icon: Trophy,
      activePattern: /^\/universo/,
    },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none md:hidden"
    >
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md border-t border-indigo-100/90 px-3 py-2 flex items-center justify-around pointer-events-auto shadow-lg shadow-indigo-950/10 rounded-t-3xl">
        {navItems.map((item) => {
          const isActive = item.activePattern.test(pathname || "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[64px] ${
                isActive
                  ? "text-[#474AB6] font-bold"
                  : "text-slate-400 hover:text-slate-700 font-medium"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive ? "bg-[#ECEEFC] scale-110" : ""
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={isActive ? "text-[#474AB6]" : "text-slate-400"}
                />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
