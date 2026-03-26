"use client";

import { Send, Search, Phone, Video, MoreVertical, Image as ImageIcon, Paperclip, CheckCircle2, MessageSquare } from "lucide-react";
import Link from "next/link";
import LockedFeature from "@/components/ui/LockedFeature";

export default function ChatPage() {
  return (
    <div className="flex-1 overflow-hidden flex bg-background p-4 sm:p-6 lg:p-8">
      <LockedFeature
        featureName="Direct Messaging"
        description={[
          "Securely message mentors, recruiters, and peers.",
          "Share resumes and documents directly in the chat.",
          "Organize your professional conversations in one place.",
          "Receive real-time notifications for important interview requests."
        ]}
      >
        <div className="flex-1 flex max-w-6xl mx-auto w-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm opacity-50">
          
          {/* Left Sidebar - Contacts List Placeholder */}
          <div className="w-full md:w-80 border-r border-border flex flex-col hidden md:flex">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold mb-4">Messages</h2>
              <div className="h-10 bg-muted/30 rounded-lg animate-pulse" />
            </div>
            
            <div className="flex-1 p-4 space-y-4">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
                </div>
              </div>
              <div className="flex gap-3 items-center opacity-50">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Area - Active Chat Placeholder */}
          <div className="flex-1 flex flex-col bg-background">
            <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 text-muted italic text-center">
              <div className="max-w-xs space-y-4">
                <MessageSquare className="w-12 h-12 mx-auto opacity-20" />
                <p>Your professional conversations will appear here.</p>
              </div>
            </div>

            <div className="p-4 bg-card border-t border-border">
              <div className="h-10 bg-muted/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </LockedFeature>
    </div>
  );
}

