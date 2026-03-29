"use client";

import Link from "next/link";
import { Plus, FileText, Trash2, Copy, Sparkles, Wand2, Zap, Rocket, Check } from "lucide-react";
import { useResumes } from "@/hooks/useResumes";
import { formatDistanceToNow } from "date-fns";
import { createEmptyResume } from "@/lib/defaultResume";
import { useRouter } from "next/navigation";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { resumes, isLoaded, deleteResume, duplicateResume, saveResume } = useResumes();
  const router = useRouter();

  const handleCreateNew = () => {
    const newResume = createEmptyResume();
    saveResume(newResume);
    router.push(`/editor/${newResume.id}`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted">Loading Resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto relative w-full overflow-hidden">
      <BackgroundAnimation />
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            My Resumes
          </h1>
          <p className="text-muted mt-2">Manage and tailor your ATS-friendly resumes.</p>
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-lg text-sm text-muted flex items-center gap-2 shadow-sm">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           Last sync: <span className="text-foreground font-medium">Recently</span>
        </div>
      </header>

      {/* AI Power-ups Section */}
      <section className="mb-12 relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">AI Power-ups</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-purple-500/10 border border-primary/20 rounded-2xl p-8 cursor-pointer transition-all hover:shadow-2xl hover:shadow-primary/5 shadow-lg"
          >
            <div className="relative z-10">
              <div className="bg-primary/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">AI Resume Architect</h3>
              <p className="text-muted mb-6 max-w-sm">
                Paste your raw experience, LinkedIn bio, or messy notes. Our AI will architect a perfect, ATS-optimized resume in seconds.
              </p>
              <Link
                href="/ai-resume"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                Launch Architect <Zap className="w-4 h-4 fill-current" />
              </Link>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-background to-primary/10 border border-purple-500/20 rounded-2xl p-8 cursor-pointer transition-all hover:shadow-2xl hover:shadow-purple-500/5 shadow-lg"
          >
            <div className="relative z-10">
              <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">AI Cover Letter Pro</h3>
              <p className="text-muted mb-6 max-w-sm">
                Choose a resume, drop the job description, and let AI craft a high-conversion cover letter that gets you through the door.
              </p>
              <Link
                href="/ai-cover-letter"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
              >
                Generate Letter <Zap className="w-4 h-4 fill-current" />
              </Link>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-background to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8 cursor-pointer transition-all hover:shadow-2xl hover:shadow-emerald-500/5 shadow-lg lg:col-span-2"
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-emerald-500 fill-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">JD to Resume Maker</h3>
                <p className="text-muted mb-6 max-w-xl">
                  Connect your existing experience to a specific opportunity. Our AI will rewrite your bullets and suggest critical missing skills to match any job description perfectly.
                </p>
                <Link
                  href="/jd-resume"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-emerald-950 font-black rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-sm"
                >
                  Tailor My Resume <Rocket className="w-4 h-4 fill-current" />
                </Link>
              </div>
              <div className="hidden md:flex flex-col gap-2 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl backdrop-blur-sm">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500"><Check className="w-3 h-3" /> Keyword Optimization</div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500"><Check className="w-3 h-3" /> Bullet Point Refinement</div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500"><Check className="w-3 h-3" /> Skill Gap Discovery</div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
          </motion.div>
        </div>
      </section>

      <div className="flex items-center gap-2 mb-6 relative z-10">
        <FileText className="w-5 h-5 text-muted" />
        <h2 className="text-xl font-bold text-foreground">My Resumes</h2>
      </div>

      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
      >
        {/* AI Resume Architect Card */}
        <motion.div
           variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
           className="relative"
        >
          <Link
            href="/ai-resume"
            className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-primary/20 via-background to-purple-500/10 border-2 border-primary/30 rounded-xl hover:border-primary hover:bg-card/50 transition-all group overflow-hidden shadow-lg"
          >
            <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
              <Wand2 className="w-8 h-8 text-primary" />
            </div>
            <span className="font-bold text-foreground text-lg">AI Resume Architect</span>
            <span className="text-xs text-muted mt-2 text-center px-4">Generate a perfect resume from raw text instantly</span>
            <div className="absolute top-0 right-0 p-2 opacity-50"><Sparkles className="w-4 h-4 text-primary" /></div>
          </Link>
        </motion.div>

        {/* AI Cover Letter Card */}
        <motion.div
           variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
           className="relative"
        >
          <Link
            href="/ai-cover-letter"
            className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-purple-500/20 via-background to-primary/10 border-2 border-purple-500/30 rounded-xl hover:border-purple-500 hover:bg-card/50 transition-all group overflow-hidden shadow-lg"
          >
            <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
            <span className="font-bold text-foreground text-lg">AI Cover Letter Pro</span>
            <span className="text-xs text-muted mt-2 text-center px-4">Tailor letters using your latest profile bio</span>
            <div className="absolute top-0 right-0 p-2 opacity-50"><Zap className="w-4 h-4 text-purple-500" /></div>
          </Link>
        </motion.div>

        {/* JD to Resume Card */}
        <motion.div
           variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
           className="relative"
        >
          <Link
            href="/jd-resume"
            className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-emerald-500/20 via-background to-teal-500/10 border-2 border-emerald-500/30 rounded-xl hover:border-emerald-500 hover:bg-card/50 transition-all group overflow-hidden shadow-lg"
          >
            <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
              <Zap className="w-8 h-8 text-emerald-500 fill-emerald-500" />
            </div>
            <span className="font-bold text-foreground text-lg">JD to Resume Maker</span>
            <span className="text-xs text-muted mt-2 text-center px-4">Tailor your existing resume to any specific job</span>
            <div className="absolute top-0 right-0 p-2 opacity-50"><Sparkles className="w-4 h-4 text-emerald-500" /></div>
          </Link>
        </motion.div>

        {/* Create New Card (Manual) */}
        <motion.button
          variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
          onClick={handleCreateNew}
          className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-card/50 transition-all group transition-all"
        >
          <div className="bg-card w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <span className="mt-4 font-medium text-foreground">Manual Create</span>
          <span className="text-xs text-muted mt-2">Build from scratch</span>
        </motion.button>

        {/* Existing Resumes */}
        {resumes.map((resume) => (
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
            key={resume.id}
            className="bg-card border border-border rounded-xl p-5 flex flex-col h-64 hover:border-primary/50 transition-colors group relative shadow-lg"
          >
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <FileText className="w-8 h-8 text-primary mb-3" />
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md border border-primary/20">
                     Match: --%
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => duplicateResume(resume.id)}
                      className="p-1.5 hover:bg-background rounded-md text-muted hover:text-foreground"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="p-1.5 hover:bg-background rounded-md text-red-500 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <h2 className="text-lg font-semibold text-foreground line-clamp-2" title={resume.title}>
                {resume.title}
              </h2>
              <p className="text-sm text-muted mt-1">
                Updated {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
              </p>
            </div>

            <div className="mt-auto pt-4 border-t border-border">
              <Link
                href={`/editor/${resume.id}`}
                className="w-full block text-center py-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors"
                prefetch={true}
              >
                Edit Resume
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
