"use client";

import { useRef } from "react";
import KanbanBoard from "@/components/tracker/KanbanBoard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";

export default function TrackerPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -350 : 350,
        behavior: 'smooth'
      });
    }
  };
  return (
    <div className="flex-1 relative overflow-hidden flex flex-col bg-background p-8 z-0">
      <BackgroundAnimation variant="tracker" />
      <div className="mb-6 relative z-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-fit drop-shadow-sm">Job Tracker</h1>
        <p className="text-muted text-lg tracking-wide">Manage your applications and organize your job hunt strategically.</p>
      </div>
      
      <div className="relative flex-1 flex flex-col min-h-0 mx-4">
        <button 
          onClick={() => scroll('left')} 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card border border-border rounded-full shadow-lg hover:bg-primary/10 hover:text-primary transition-colors -ml-5"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-x-auto hide-scrollbar scroll-smooth w-full px-2" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}} />
          <KanbanBoard />
        </div>

        <button 
          onClick={() => scroll('right')} 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card border border-border rounded-full shadow-lg hover:bg-primary/10 hover:text-primary transition-colors -mr-5"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
