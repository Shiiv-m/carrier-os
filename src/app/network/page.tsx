"use client";

import { useState } from "react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Image as ImageIcon, 
  Video, 
  Smile, 
  Send,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";
import Link from "next/link";
import LockedFeature from "@/components/ui/LockedFeature";

export default function NetworkPage() {
  return (
    <div className="flex-1 relative overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-10 z-0">
      <BackgroundAnimation variant="network" />

      <LockedFeature
        featureName="Professional Network"
        description={[
          "Connect with professionals in your target industries.",
          "Share career updates and industry insights with your peers.",
          "Get referrals and networking opportunities effortlessly.",
          "Stay updated with the latest trends in your professional circle."
        ]}
      >
        <div className="max-w-2xl mx-auto space-y-6 relative z-10 pb-20">
          
          {/* Create Post Composer Placeholder */}
          <div className="bg-card border border-border shadow-sm rounded-2xl p-4 opacity-50">
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-violet-500 flex items-center justify-center text-white font-bold shrink-0">
                S
              </div>
              <div className="flex-1 h-[60px] text-muted pt-2 text-sm italic">
                What's happening in your career?
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1">
                <ImageIcon className="w-5 h-5 text-muted opacity-50" />
                <Video className="w-5 h-5 text-muted ml-2 opacity-50" />
              </div>
              
              <div className="bg-primary/30 text-white/50 px-5 py-1.5 rounded-full font-medium text-sm flex items-center gap-2">
                Post <Send className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>

          {/* Dynamic Feed Placeholder */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 h-40 flex items-center justify-center text-muted italic">
              Loading your professional network feed...
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 opacity-40">
               <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                     <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                     <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
                  </div>
               </div>
               <div className="h-20 bg-muted/30 rounded w-full animate-pulse" />
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 opacity-20">
               <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                     <div className="h-4 bg-muted rounded w-1/3" />
                  </div>
               </div>
               <div className="h-10 bg-muted/30 rounded w-full" />
            </div>
          </div>
        </div>
      </LockedFeature>
    </div>
  );
}

