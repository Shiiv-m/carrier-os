"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  ThumbsUp, 
  Medal, 
  ShieldCheck, 
  Trophy, 
  Crown, 
  User, 
  Star,
  Flame,
  Search,
  CheckCircle2,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";
import Link from "next/link";
import LockedFeature from "@/components/ui/LockedFeature";

const makeSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

// Rank-based styling system
const getRankBadgeAndStyle = (index: number, totalUsers: number) => {
  const rank = index + 1;
  const percentile = rank / totalUsers;

  // Podium
  if (rank === 1) return { name: "Rank #1", color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/30", highlightClass: "bg-yellow-500/10 border border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.2)]", icon: Crown, numColor: "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] font-black text-lg" };
  if (rank === 2) return { name: "Rank #2", color: "text-zinc-300", bg: "bg-zinc-300/10 border-zinc-300/30", highlightClass: "bg-zinc-300/10 border border-zinc-300/30 shadow-[0_0_15px_rgba(212,212,216,0.15)]", icon: Medal, numColor: "text-zinc-300 drop-shadow-[0_0_5px_rgba(212,212,216,0.6)] font-extrabold text-base" };
  if (rank === 3) return { name: "Rank #3", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30", highlightClass: "bg-orange-400/10 border border-orange-400/30 shadow-[0_0_15px_rgba(251,146,60,0.15)]", icon: Medal, numColor: "text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.6)] font-bold text-base" };
  
  // Tiers
  if (rank <= 10) return { name: "Top 10", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30", highlightClass: "hover:bg-purple-500/10 bg-purple-500/5 border border-purple-500/20", icon: Trophy, numColor: "text-purple-400 font-bold" };
  if (rank <= 50) return { name: "Top 50", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30", highlightClass: "hover:bg-blue-500/10 bg-blue-500/5 border border-blue-500/20", icon: Star, numColor: "text-blue-400 font-bold" };
  if (rank <= 100) return { name: "Top 100", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", highlightClass: "hover:bg-emerald-500/10 bg-emerald-500/5 border border-emerald-500/20", icon: ShieldCheck, numColor: "text-emerald-400 font-bold" };
  
  // Percentiles
  if (percentile <= 0.01) return { name: "Top 1%", color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20", highlightClass: "hover:bg-white/5 border border-transparent hover:border-border", icon: Flame, numColor: "text-pink-500/70" };
  if (percentile <= 0.05) return { name: "Top 5%", color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20", highlightClass: "hover:bg-white/5 border border-transparent hover:border-border", icon: ThumbsUp, numColor: "text-rose-500/70" };
  if (percentile <= 0.10) return { name: "Top 10%", color: "text-indigo-400", bg: "bg-indigo-400/10 border-indigo-400/20", highlightClass: "hover:bg-white/5 border border-transparent hover:border-border", icon: ThumbsUp, numColor: "text-indigo-500/70" };

  // Remaining
  return { name: "Contributor", color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20", highlightClass: "hover:bg-white/5 border border-transparent hover:border-border", icon: User, numColor: "text-zinc-600" };
};

const BADGE_TIERS = [
  { name: "Rank 1, 2, 3", rankInfo: "Podium", desc: "The elite reviewers. Absolute legends with custom glows.", icon: Crown, color: "text-yellow-500" },
  { name: "Top 4 - 10", rankInfo: "Diamond Tier", desc: "Highest tier of dedicated community members.", icon: Trophy, color: "text-purple-400" },
  { name: "Top 50", rankInfo: "Ruby Tier", desc: "Highly active and trusted members.", icon: Star, color: "text-blue-400" },
  { name: "Top 100", rankInfo: "Emerald Tier", desc: "Consistent helpful feedback.", icon: ShieldCheck, color: "text-emerald-400" },
  { name: "Top 1%, 5%, 10%", rankInfo: "Percentile", desc: "Top percentile ranks based on total users.", icon: Flame, color: "text-pink-400" },
  { name: "Contributor", rankInfo: "Remaining", desc: "Standard community member badge.", icon: User, color: "text-zinc-400" },
];

const FEED_ITEMS = [
  {
    id: "1",
    role: "Senior Full Stack Developer",
    industry: "FinTech",
    snippet: "Spearheaded the migration of a legacy monolithic architecture to microservices using Node.js and Docker, reducing API latency by 45%.",
    isAnonymized: true,
    pointsBounty: 50,
    comments: 12,
    timeAgo: "2 hours ago"
  },
  {
    id: "2",
    role: "Product Manager",
    industry: "E-Commerce",
    snippet: "Led cross-functional team of 15 designers and engineers to launch the new checkout experience, driving a 12% increase in conversion rate.",
    isAnonymized: false,
    author: "Alex Morgan",
    pointsBounty: 100,
    comments: 34,
    timeAgo: "5 hours ago"
  },
  {
    id: "3",
    role: "Data Scientist",
    industry: "Healthcare",
    snippet: "Developed a predictive model using Random Forest to identify high-risk patients, achieving 92% accuracy and saving $2M in operational costs.",
    isAnonymized: true,
    pointsBounty: 25,
    comments: 3,
    timeAgo: "1 day ago"
  }
];

const LEADERBOARD = [
  { id: "1", name: "Sarah Chen", company: "Google", karmaPoints: 12500, successfulHires: 42, isVerified: true },
  { id: "2", name: "James Wilson", company: "Stripe", karmaPoints: 9800, successfulHires: 31, isVerified: true },
  { id: "3", name: "Priya Patel", company: "Netflix", karmaPoints: 7200, successfulHires: 18, isVerified: true },
  { id: "4", name: "Marcus Johnson", company: "Meta", karmaPoints: 6850, successfulHires: 14, isVerified: false },
  { id: "5", name: "Elena Rodriguez", company: "Amazon", karmaPoints: 6120, successfulHires: 10, isVerified: true },
  { id: "6", name: "David Kim", company: "Apple", karmaPoints: 5900, successfulHires: 8, isVerified: true },
  { id: "7", name: "Anita Smith", company: "Microsoft", karmaPoints: 5400, successfulHires: 7, isVerified: false },
  { id: "8", name: "John Doe", company: "Tesla", karmaPoints: 5100, successfulHires: 5, isVerified: true },
  { id: "9", name: "Emily Clark", company: "Spotify", karmaPoints: 4900, successfulHires: 4, isVerified: true },
  { id: "10", name: "Michael Lee", company: "Airbnb", karmaPoints: 4700, successfulHires: 4, isVerified: false },
  { id: "11", name: "Chris Evans", company: "Uber", karmaPoints: 4500, successfulHires: 3, isVerified: true },
  { id: "12", name: "Jessica Alba", company: "Lyft", karmaPoints: 4200, successfulHires: 2, isVerified: true },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [showBadgeExplainer, setShowBadgeExplainer] = useState(false);

  // My Stats
  const myTotalUsers = 1250;
  const myRank = 42;
  const myKarma = 450;
  const myBadgeStyle = getRankBadgeAndStyle(myRank - 1, myTotalUsers);

  return (
    <div className="flex-1 relative overflow-x-hidden overflow-y-auto bg-background p-6 lg:p-10">
      <BackgroundAnimation variant="community" />
      
      <LockedFeature 
        featureName="Community Hub" 
        description={[
          "Anonymously review resumes from community members.",
          "Earn Karma points for every helpful feedback provided.",
          "Build your reputation as a top-tier industry professional.",
          "Unlock exclusive community badges and rewards."
        ]}
      >
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Main Feed Column */}
          <div className="flex-1 max-w-4xl space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                Peer Review <ShieldCheck className="w-8 h-8 text-indigo-500" />
              </h1>
              <p className="text-muted mt-2 text-lg">
                Anonymously review resumes, earn Karma, and climb the ranks.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab("feed")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'feed' ? 'bg-primary/20 text-primary' : 'text-muted hover:text-foreground hover:bg-white/5'}`}
                >
                  Latest Requests
                </button>
                <button 
                  onClick={() => setActiveTab("hired")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'hired' ? 'bg-green-500/20 text-green-500' : 'text-muted hover:text-foreground hover:bg-white/5'}`}
                >
                  <Crown className="w-4 h-4" /> Success Stories
                </button>
              </div>
              <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-md hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                Request Review
              </button>
            </div>

            {/* Feed Items */}
            <div className="space-y-6 pb-12">
              {FEED_ITEMS.map((item) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.id} 
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-white font-bold shadow-inner">
                        {item.isAnonymized ? <User className="w-6 h-6 opacity-50" /> : item.author?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                          {item.role} 
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {item.industry}
                          </span>
                        </h3>
                        <p className="text-sm text-muted flex items-center gap-1.5">
                          {item.isAnonymized ? (
                            "Anonymous User"
                          ) : (
                            <Link href={`/u/${makeSlug(item.author!)}`} className="hover:underline text-foreground font-medium">{item.author}</Link>
                          )}
                          <span className="text-muted font-normal">• {item.timeAgo}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-lg border border-orange-500/20 font-bold">
                      <Flame className="w-4 h-4" /> +{item.pointsBounty} Karma
                    </div>
                  </div>

                  <div className="relative pl-4 border-l-2 border-primary/30 py-2 my-4">
                    <p className="text-zinc-300 text-lg italic leading-relaxed">
                      "{item.snippet}"
                    </p>
                    <div className="absolute top-0 left-0 w-8 h-8 bg-primary/10 -translate-x-[17px] -translate-y-[10px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Search className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50 text-sm">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-1.5 text-muted hover:text-primary transition-colors">
                        <MessageSquare className="w-4 h-4" /> {item.comments} Feedback
                      </button>
                      <button className="flex items-center gap-1.5 text-muted hover:text-green-500 transition-colors">
                        <ThumbsUp className="w-4 h-4" /> Helpful
                      </button>
                    </div>
                    <button className="text-primary font-medium hover:underline flex items-center gap-1">
                      Review & Earn <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Leaderboard & Stats */}
          <div className="w-full xl:w-96 shrink-0 space-y-6">
            {/* User Stats Card */}
            <div className="relative bg-gradient-to-b from-indigo-500/10 to-card border border-indigo-500/30 rounded-2xl p-6 shadow-lg shadow-indigo-500/10 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-indigo-400 ring-offset-2 ring-offset-background`}>
                  S
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-0.5 cursor-pointer hover:underline text-foreground"><Link href={`/u/shivam-sharma`}>Shivam Sharma</Link></h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] bg-background border border-border px-1.5 py-0.5 rounded-md text-muted font-medium font-mono`}>
                      Rank #{myRank}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${myBadgeStyle.bg} ${myBadgeStyle.color} uppercase tracking-wider`}>
                      <myBadgeStyle.icon className="w-3 h-3" /> {myBadgeStyle.name}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                <div className="bg-background rounded-xl p-3 border border-border hover:border-indigo-500/30 transition-colors cursor-default group">
                  <p className="text-xs text-muted mb-1 group-hover:text-indigo-400 transition-colors">Karma Points</p>
                  <p className="text-2xl font-black text-foreground flex items-center gap-1.5">
                     <Flame className="w-5 h-5 text-orange-500" /> {myKarma}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-3 border border-border hover:border-green-500/30 transition-colors cursor-default group">
                  <p className="text-xs text-muted mb-1 group-hover:text-green-500 transition-colors">Hires Helped</p>
                  <p className="text-2xl font-black text-foreground flex items-center gap-1.5">
                    <Medal className="w-5 h-5 text-green-500" /> 0
                  </p>
                </div>
              </div>
              
              <div className="relative z-10">
                <button className="w-full bg-[#0A66C2] hover:bg-[#084e96] text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Verify w/ LinkedIn
                </button>
              </div>
            </div>

            {/* Global Leaderboard */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                  <Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard
                </h3>
              </div>

              <div className="space-y-3">
                {LEADERBOARD.slice(0, 5).map((user, index) => {
                  const style = getRankBadgeAndStyle(index, 1250);
                  const isRank1 = index === 0;
                  
                  return (
                    <div 
                      key={user.id} 
                      className={`flex gap-3 items-center p-3 rounded-xl transition-all block w-full ${style.highlightClass}`}
                    >
                      <div className={`w-8 flex shrink-0 justify-center ${style.numColor}`}>
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-semibold text-sm truncate text-foreground`}>
                            {user.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] text-muted">{user.karmaPoints.toLocaleString()} K</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badge System Explainer */}
            <div className="bg-background border border-border rounded-2xl p-1 overflow-hidden">
              <button 
                onClick={() => setShowBadgeExplainer(!showBadgeExplainer)}
                className="w-full flex items-center justify-between p-4 hover:bg-card transition-colors rounded-xl"
              >
                <span className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Info className="w-4 h-4 text-purple-400" /> Badge System
                </span>
                <ChevronRight className={`w-4 h-4 text-muted transition-transform ${showBadgeExplainer ? 'rotate-90' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showBadgeExplainer && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 overflow-hidden"
                  >
                    <div className="space-y-3 pt-2 border-t border-border/50 mt-2">
                      {BADGE_TIERS.slice(0, 3).map(tier => (
                        <div key={tier.name} className="flex gap-3 items-start bg-card p-3 rounded-xl border border-border/50">
                           <tier.icon className={`w-4 h-4 shrink-0 ${tier.color}`} />
                           <p className="text-xs text-muted leading-tight">{tier.name}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </LockedFeature>
    </div>
  );
}


