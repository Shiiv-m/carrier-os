"use client";

import { useEffect, useState, useRef } from "react";
import { UserCircle, Save, CheckCircle2, Plus, X, UploadCloud, MapPin, Link as LinkIcon, Calendar, Briefcase, Award, Camera, Crown, Medal, Trophy, Star, ShieldCheck, Flame, User, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";

// Shared Rank Logic
const getRankBadgeAndStyle = (index: number, totalUsers: number) => {
  const rank = index + 1;
  const percentile = rank / totalUsers;

  if (rank === 1) return { name: "Rank #1", color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/30", highlightClass: "bg-yellow-500/10 border border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.2)]", icon: Crown, numColor: "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] font-black text-lg" };
  if (rank === 2) return { name: "Rank #2", color: "text-zinc-300", bg: "bg-zinc-300/10 border-zinc-300/30", highlightClass: "bg-zinc-300/10 border border-zinc-300/30 shadow-[0_0_15px_rgba(212,212,216,0.15)]", icon: Medal, numColor: "text-zinc-300 drop-shadow-[0_0_5px_rgba(212,212,216,0.6)] font-extrabold text-base" };
  if (rank === 3) return { name: "Rank #3", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30", highlightClass: "bg-orange-400/10 border border-orange-400/30 shadow-[0_0_15px_rgba(251,146,60,0.15)]", icon: Medal, numColor: "text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.6)] font-bold text-base" };
  if (rank <= 10) return { name: "Top 10", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30", highlightClass: "hover:bg-purple-500/10 bg-purple-500/5 border border-purple-500/20", icon: Trophy, numColor: "text-purple-400 font-bold" };
  if (rank <= 50) return { name: "Top 50", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30", highlightClass: "hover:bg-blue-500/10 bg-blue-500/5 border border-blue-500/20", icon: Star, numColor: "text-blue-400 font-bold" };
  if (rank <= 100) return { name: "Top 100", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", highlightClass: "hover:bg-emerald-500/10 bg-emerald-500/5 border border-emerald-500/20", icon: ShieldCheck, numColor: "text-emerald-400 font-bold" };
  if (percentile <= 0.01) return { name: "Top 1%", color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20", highlightClass: "hover:bg-white/5 border border-transparent hover:border-border", icon: Flame, numColor: "text-pink-500/70" };
  if (percentile <= 0.05) return { name: "Top 5%", color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20", highlightClass: "hover:bg-white/5 border border-transparent hover:border-border", icon: ThumbsUp, numColor: "text-rose-500/70" };
  if (percentile <= 0.10) return { name: "Top 10%", color: "text-indigo-400", bg: "bg-indigo-400/10 border-indigo-400/20", highlightClass: "hover:bg-white/5 border border-transparent hover:border-border", icon: ThumbsUp, numColor: "text-indigo-500/70" };
  return { name: "Contributor", color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20", highlightClass: "hover:bg-white/5 border border-transparent hover:border-border", icon: User, numColor: "text-zinc-600" };
};

export default function ProfilePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Shivam Sharma",
    headline: "Software Engineer",
    location: "San Francisco, CA",
    website: "portfolio.dev",
    imageUrl: "",
    bannerUrl: "",
    bio: "Passionate software architect and designer specialized in building scalable, user-centric web applications. Currently focused on integrating AI-driven insights into everyday productivity tools. Always happy to review resumes and connect with like-minded individuals!",
    skills: ["React", "Next.js", "TypeScript", "System Design", "UI/UX", "Node.js"] as string[],
    experience: [
      { role: "Senior Developer", company: "Tech Innovators Inc. • 2022 - Present", desc: "Spearheaded the migration of legacy monolithic architectures into decoupled microservices, improving deployment velocity by 40%." },
      { role: "Software Engineer", company: "Global Systems LLC • 2019 - 2022", desc: "Developed core components for the internal CRM using React and Node.js. Reduced load times by 2.5s." }
    ]
  });

  // Mock Ranking
  const myTotalUsers = 1250;
  let myRank = 42; 
  const rankStyle = getRankBadgeAndStyle(myRank - 1, myTotalUsers);
  const isRank1 = myRank === 1;

  useEffect(() => {
    const data = localStorage.getItem("donedone_profile");
    if (data) {
      try {
        const p = JSON.parse(data);
        setProfile({
          ...profile,
          name: p.name || profile.name,
          headline: p.headline || profile.headline,
          location: p.location || profile.location,
          website: p.website || profile.website,
          imageUrl: p.imageUrl || "",
          bannerUrl: p.bannerUrl || "",
          bio: p.bio || profile.bio,
          skills: p.skills && p.skills.length > 0 ? p.skills : profile.skills,
          experience: p.experience && p.experience.length > 0 ? p.experience : profile.experience
        });
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem("donedone_profile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({...profile, skills: [...profile.skills, skillInput.trim()]});
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({...profile, skills: profile.skills.filter(s => s !== skill)});
  };

  const handleImageUpload = (file: File, type: 'avatar' | 'banner') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') setProfile({ ...profile, imageUrl: reader.result as string });
        if (type === 'banner') setProfile({ ...profile, bannerUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="flex-1 relative overflow-x-hidden overflow-y-auto bg-background z-0">
      <BackgroundAnimation variant="profile" />

      {/* Save Header Action */}
      <div className="fixed top-24 right-8 z-50">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]"
        >
          {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />} 
          {saved ? "Saved!" : "Save Profile"}
        </button>
      </div>
      
      {/* Banner Section */}
      <div 
        className={`h-48 md:h-64 w-full relative z-10 border-b border-border/50 group cursor-pointer overflow-hidden flex items-center justify-center transition-all ${
          isDraggingBanner ? 'border-primary border-4 bg-primary/10' :
          isRank1 
            ? 'bg-gradient-to-r from-yellow-500/30 via-orange-500/20 to-yellow-600/30 shadow-[0_0_50px_rgba(234,179,8,0.15)]' 
            : 'bg-gradient-to-r from-primary/20 via-purple-500/10 to-pink-500/20'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDraggingBanner(true); }}
        onDragLeave={() => setIsDraggingBanner(false)}
        onDrop={(e) => { e.preventDefault(); setIsDraggingBanner(false); if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0], 'banner'); }}
        onClick={() => bannerInputRef.current?.click()}
      >
        {profile.bannerUrl && (
          <img src={profile.bannerUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
        )}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <Camera className="w-8 h-8 text-white mb-2 shadow-sm" />
          <span className="text-white text-xs font-bold uppercase tracking-wider shadow-sm">Change Banner</span>
        </div>
        <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')} />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 pb-20">
        
        {/* Profile Header section */}
        <div className="relative -mt-16 sm:-mt-24 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-end w-full">
            <div 
              className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background bg-card flex items-center justify-center text-4xl sm:text-6xl font-bold text-white shadow-xl shrink-0 group cursor-pointer transition-all overflow-hidden ${
                isDraggingAvatar ? 'ring-4 ring-primary scale-105' :
                isRank1 
                  ? 'bg-gradient-to-tr from-yellow-500 to-orange-500 ring-4 ring-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.4)]'
                  : 'bg-gradient-to-tr from-zinc-700 to-zinc-600'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDraggingAvatar(true); }}
              onDragLeave={() => setIsDraggingAvatar(false)}
              onDrop={(e) => { e.preventDefault(); setIsDraggingAvatar(false); if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0], 'avatar'); }}
              onClick={() => avatarInputRef.current?.click()}
            >
              {profile.imageUrl ? (
                <img src={profile.imageUrl} alt="Profile" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              ) : (
                profile.name.charAt(0) || "U"
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <UploadCloud className="w-8 h-8 text-white mb-2" />
              </div>
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'avatar')} />
            </div>
            
            <div className="pb-2 flex-1 w-full relative group">
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="text-3xl font-extrabold flex items-center gap-2 bg-transparent focus:outline-none focus:bg-white/5 border border-transparent focus:border-border rounded-lg outline-none -ml-2 px-2 py-1 transition-colors w-full sm:max-w-xs"
                placeholder="Your Name"
              />
              <p className="text-lg text-muted font-medium flex items-center gap-2 ml-1 mt-1">
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
              
              <div className="flex flex-wrap gap-2 mt-3 text-sm text-zinc-400 font-medium ml-1">
                <div className="flex items-center gap-1 bg-background border border-border px-2 py-1 rounded-md">
                  <MapPin className="w-3.5 h-3.5" /> 
                  <input value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} className="bg-transparent border-none outline-none w-24 sm:w-32 focus:w-40 transition-all text-xs" placeholder="City, Country" />
                </div>
                <div className="flex items-center gap-1 bg-background border border-border px-2 py-1 rounded-md">
                  <LinkIcon className="w-3.5 h-3.5" /> 
                  <input value={profile.website} onChange={e => setProfile({...profile, website: e.target.value})} className="bg-transparent border-none outline-none w-24 sm:w-32 focus:w-40 transition-all text-xs" placeholder="website.com" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm group">
              <h2 className="text-xl font-bold mb-3">About</h2>
              <textarea
                value={profile.bio}
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="w-full min-h-[120px] bg-transparent hover:bg-white/5 focus:bg-white/5 text-zinc-300 leading-relaxed resize-none border border-transparent hover:border-border focus:border-border rounded-lg p-2 -ml-2 transition-colors outline-none"
                placeholder="Write a brief overview of your professional self..."
              />
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold flex items-center gap-2"><Briefcase className="w-5 h-5 text-purple-400" /> Recent Experience</h2>
              </div>
              <div className="space-y-6">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-primary/30 group">
                    <div className="absolute w-3 h-3 bg-primary rounded-full left-[-7px] top-1.5 ring-4 ring-background"></div>
                    <input 
                      value={exp.role} 
                      onChange={e => {
                        const newExp = [...profile.experience];
                        newExp[i].role = e.target.value;
                        setProfile({...profile, experience: newExp});
                      }}
                      className="font-semibold text-lg bg-transparent border-transparent hover:border-border focus:border-border focus:bg-white/5 rounded px-1 -ml-1 transition-colors outline-none w-full"
                    />
                    <input 
                      value={exp.company} 
                      onChange={e => {
                        const newExp = [...profile.experience];
                        newExp[i].company = e.target.value;
                        setProfile({...profile, experience: newExp});
                      }}
                      className="text-primary text-sm font-medium mb-1 bg-transparent border-transparent hover:border-border focus:border-border focus:bg-white/5 rounded px-1 -ml-1 transition-colors outline-none w-full"
                    />
                    <textarea 
                      value={exp.desc} 
                      onChange={e => {
                        const newExp = [...profile.experience];
                        newExp[i].desc = e.target.value;
                        setProfile({...profile, experience: newExp});
                      }}
                      className="text-muted text-sm leading-relaxed bg-transparent border-transparent hover:border-border focus:border-border focus:bg-white/5 rounded px-1 min-h-[60px] resize-none -ml-1 transition-colors outline-none w-full"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-yellow-500" /> Community Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">Karma Points</span>
                  <span className="font-bold text-orange-400">450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">Successful Hires</span>
                  <span className="font-bold text-green-400">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">Resumes Reviewed</span>
                  <span className="font-bold">2</span>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Top Skills</h2>
              <div className="flex gap-2 mb-4">
                 <input
                   type="text"
                   placeholder="Add skill..."
                   value={skillInput}
                   onChange={(e) => setSkillInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                   className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary"
                 />
                 <button onClick={addSkill} className="bg-primary/20 text-primary hover:bg-primary/30 px-3 py-2 rounded-lg text-xs font-semibold">
                   Add
                 </button>
               </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="bg-primary/10 group flex items-center gap-1.5 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold transition-all">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:bg-primary/30 rounded-full p-0.5"><X className="w-3 h-3"/></button>
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
