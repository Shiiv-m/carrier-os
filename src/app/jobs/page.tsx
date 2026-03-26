"use client";

import { Search, MapPin, Briefcase, Building2, Filter, Sparkles } from "lucide-react";
import LockedFeature from "@/components/ui/LockedFeature";

export default function JobsPage() {
  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden relative">
      <LockedFeature
        featureName="Job Search Engine"
        description={[
          "AI-powered job matching based on your resume profile.",
          "Track application status across multiple job boards automatically.",
          "Get instant alerts for roles that match your top skills.",
          "Analyze job descriptions to see your match score before applying."
        ]}
      >
        <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8 opacity-40">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              Job Search Engine <Sparkles className="w-8 h-8 text-primary" />
            </h1>
            <p className="text-muted text-lg">
              Find your next role with intelligent matching and automated tracking.
            </p>
          </div>

          {/* Search Bar Placeholder */}
          <div className="bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row gap-4 shadow-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <div className="w-full h-12 bg-muted/20 rounded-xl" />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <div className="w-full h-12 bg-muted/20 rounded-xl" />
            </div>
            <button className="bg-primary px-8 h-12 rounded-xl text-white font-bold">
              Search Jobs
            </button>
          </div>

          {/* Filters Bar Placeholder */}
          <div className="flex gap-3 overflow-x-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-6 h-10 bg-card border border-border rounded-full flex items-center gap-2 shrink-0">
                <div className="w-3 h-3 bg-muted rounded-full" />
                <div className="w-16 h-4 bg-muted/30 rounded" />
              </div>
            ))}
          </div>

          {/* Job Listings Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-muted" />
                  <div className="w-20 h-6 bg-muted/20 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
                <div className="pt-4 border-t border-border/50 flex justify-between items-center text-muted">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="w-4 h-4" /> 
                    <div className="w-20 h-3 bg-muted/20 rounded" />
                  </div>
                  <div className="w-16 h-3 bg-muted/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </LockedFeature>
    </div>
  );
}
