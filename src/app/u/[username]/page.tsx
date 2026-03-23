"use client";

import { MessageSquare, UserPlus, MapPin, Link as LinkIcon, Calendar, CheckCircle2, Award, Briefcase, Crown, Medal, Trophy, Star, ShieldCheck, Flame, User, ThumbsUp } from "lucide-react";
import Link from "next/link";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";
import { useEffect, useState } from "react";

// Shared Rank Logic
const getRankBadgeAndStyle = (index: number, totalUsers: number) => {
  const rank = index + 1;
  const percentile = rank / totalUsers;

  if (rank === 1) return { name: "Rank #1", color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/30", icon: Crown, numColor: "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" };
  if (rank === 2) return { name: "Rank #2", color: "text-zinc-300", bg: "bg-zinc-300/10 border-zinc-300/30", icon: Medal, numColor: "text-zinc-300 drop-shadow-[0_0_5px_rgba(212,212,216,0.6)]" };
  if (rank === 3) return { name: "Rank #3", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30", icon: Medal, numColor: "text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.6)]" };
  if (rank <= 10) return { name: "Top 10", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30", icon: Trophy, numColor: "text-purple-400" };
  if (rank <= 50) return { name: "Top 50", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30", icon: Star, numColor: "text-blue-400" };
  if (rank <= 100) return { name: "Top 100", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", icon: ShieldCheck, numColor: "text-emerald-400" };
  if (percentile <= 0.01) return { name: "Top 1%", color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20", icon: Flame, numColor: "text-pink-500/70" };
  if (percentile <= 0.05) return { name: "Top 5%", color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20", icon: ThumbsUp, numColor: "text-rose-500/70" };
  if (percentile <= 0.10) return { name: "Top 10%", color: "text-indigo-400", bg: "bg-indigo-400/10 border-indigo-400/20", icon: ThumbsUp, numColor: "text-indigo-500/70" };
  return { name: "Contributor", color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20", icon: User, numColor: "text-zinc-600" };
};

const LEADERBOARD = [
  { id: "1", name: "Sarah Chen", company: "Google", karmaPoints: 12500, successfulHires: 42, isVerified: true },
  { id: "2", name: "James Wilson", company: "Stripe", karmaPoints: 9800, successfulHires: 31, isVerified: true },
  { id: "3", name: "Priya Patel", company: "Netflix", karmaPoints: 7200, successfulHires: 18, isVerified: true },
  { id: "4", name: "Marcus Johnson", company: "Meta", karmaPoints: 6850, successfulHires: 14, isVerified: false },
  { id: "5", name: "Elena Rodriguez", company: "Amazon", karmaPoints: 6120, successfulHires: 10, isVerified: true },
  { id: "6", name: "David Kim", company: "Apple", karmaPoints: 5900, successfulHires: 8, isVerified: true },
];

export default function PublicProfile({ params }: { params: { username: string } }) {
  const [usernameStr, setUsernameStr] = useState("Loading...");

  useEffect(() => {
    // Await params if using standard Next 14/15 async params, but in a client component we can just use React.use or directly access it.
    const resolveParams = async () => {
      // In case params is a promise in Next 15
      const resolved = await params;
      const formatted = decodeURIComponent(resolved.username)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setUsernameStr(formatted);
    }
    resolveParams();
  }, [params]);

  const userIndex = LEADERBOARD.findIndex(u => u.name.toLowerCase() === usernameStr.toLowerCase());
  const rankStyle = userIndex !== -1 ? getRankBadgeAndStyle(userIndex, 1250) : null;
  const isRank1 = userIndex === 0;

  return (
    <div className="flex-1 relative overflow-x-hidden overflow-y-auto bg-background z-0">
      <BackgroundAnimation variant="profile" />
      
      {/* Banner */}
      <div className={`h-48 md:h-64 w-full relative z-10 border-b border-border/50 ${
        isRank1 
          ? 'bg-gradient-to-r from-yellow-500/30 via-orange-500/20 to-yellow-600/30 shadow-[0_0_50px_rgba(234,179,8,0.15)]' 
          : 'bg-gradient-to-r from-primary/20 via-purple-500/10 to-pink-500/20'
      }`}></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 pb-20">
        
        {/* Profile Header section */}
        <div className="relative -mt-16 sm:-mt-24 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-end">
            <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background bg-card flex items-center justify-center text-4xl sm:text-6xl font-bold text-white shadow-xl shrink-0 transition-all ${
              isRank1 
                ? 'bg-gradient-to-tr from-yellow-500 to-orange-500 ring-4 ring-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.4)]'
                : 'bg-gradient-to-tr from-zinc-700 to-zinc-600'
            }`}>
              {usernameStr.charAt(0)}
            </div>
            <div className="pb-2">
              <h1 className="text-3xl font-extrabold flex items-center gap-2">
                {usernameStr}
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
              </h1>
              <p className="text-lg text-muted font-medium mt-1 flex items-center gap-2">
                Verified Professional 
                {rankStyle && (
                  <>
                    <span>•</span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${rankStyle.bg} ${rankStyle.color} uppercase`}>
                      <rankStyle.icon className="w-3.5 h-3.5" /> {rankStyle.name}
                    </span>
                  </>
                )}
                {!rankStyle && <span>• Top 5% Peer Reviewer</span>}
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-zinc-400 font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> San Francisco, CA</span>
                <span className="flex items-center gap-1"><LinkIcon className="w-4 h-4" /> portfolio.dev</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined March 2024</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pb-2 w-full sm:w-auto">
            <Link href="/chat" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20">
              <MessageSquare className="w-4 h-4" /> Message
            </Link>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-card hover:bg-white/5 border border-border px-6 py-2.5 rounded-lg font-medium transition-colors">
              <UserPlus className="w-4 h-4" /> Connect
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-zinc-300 leading-relaxed">
                Passionate software architect and designer specialized in building scalable, user-centric web applications. Currently focused on integrating AI-driven insights into everyday productivity tools. Always happy to review resumes and connect with like-minded individuals!
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-purple-400" /> Recent Experience</h2>
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-primary/30">
                  <div className="absolute w-3 h-3 bg-primary rounded-full left-[-7px] top-1.5 ring-4 ring-background"></div>
                  <h3 className="font-semibold text-lg">Senior Developer</h3>
                  <p className="text-primary text-sm font-medium mb-2">Tech Innovators Inc. • 2022 - Present</p>
                  <p className="text-muted text-sm leading-relaxed">Spearheaded the migration of legacy monolithic architectures into decoupled microservices, improving deployment velocity by 40%.</p>
                </div>
                <div className="relative pl-6 border-l-2 border-primary/30">
                  <div className="absolute w-3 h-3 bg-zinc-500 rounded-full left-[-7px] top-1.5 ring-4 ring-background"></div>
                  <h3 className="font-semibold text-lg">Software Engineer</h3>
                  <p className="text-muted text-sm font-medium mb-2">Global Systems LLC • 2019 - 2022</p>
                  <p className="text-muted text-sm leading-relaxed">Developed core components for the internal CRM using React and Node.js. Reduced load times by 2.5s.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-yellow-500" /> Community Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Karma Points</span>
                  <span className="font-bold text-orange-400">12,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Successful Hires</span>
                  <span className="font-bold text-green-400">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Resumes Reviewed</span>
                  <span className="font-bold">156</span>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Top Skills</h2>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "TypeScript", "System Design", "UI/UX", "Node.js"].map(skill => (
                  <span key={skill} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

        </div>

      </div>
    </div>
  );
}
