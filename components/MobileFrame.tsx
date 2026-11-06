import React from "react";
import BottomNav from "./BottomNav";

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-slate-100/80 flex justify-center items-start antialiased text-slate-800">
      {/* Outer wrapper simulating mobile device on desktop while full width on phones */}
      <div className="w-full max-w-md min-h-screen bg-white shadow-2xl shadow-slate-300/60 relative flex flex-col border-x border-slate-200/50 pb-20">
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
