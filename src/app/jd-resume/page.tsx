"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Send, Loader2, Zap, Brain, Rocket, FileText, Check } from "lucide-react";
import Link from "next/link";
import { autoTailorResume } from "@/lib/gemini";
import { useResumes } from "@/hooks/useResumes";
import { v4 as uuidv4 } from "uuid";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";

export default function JDResumePage() {
  const { resumes, isLoaded, saveResume } = useResumes();
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Pre-select the latest resume
  useState(() => {
    if (isLoaded && resumes.length > 0 && !selectedResumeId) {
       const latest = [...resumes].sort((a, b) => 
         new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
       )[0];
       setSelectedResumeId(latest.id);
    }
  });

  const handleTailor = async () => {
    if (!selectedResumeId || !jobDescription.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const selectedResume = resumes.find(r => r.id === selectedResumeId);
      if (!selectedResume) throw new Error("Resume not found");

      // Call AI to tailor
      const result = await autoTailorResume(
        selectedResume.experience,
        selectedResume.skills,
        jobDescription
      );

      // Create a NEW resume (duplicate + update)
      const now = new Date().toISOString();
      const tailoredResume = {
        ...selectedResume,
        id: uuidv4(),
        title: `${selectedResume.title} (Tailored)`,
        createdAt: now,
        updatedAt: now,
        // Update experience descriptions
        experience: selectedResume.experience.map(exp => {
          const tailoredExp = result.experiences.find(te => te.id === exp.id);
          return tailoredExp ? { ...exp, description: tailoredExp.description } : exp;
        }),
        // Add new skills
        skills: [
          ...selectedResume.skills,
          ...result.skillsToAdd.map(skillName => ({
            id: uuidv4(),
            name: skillName
          }))
        ]
      };

      saveResume(tailoredResume);
      router.push(`/editor/${tailoredResume.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to tailor your resume. Please try again.");
      setIsGenerating(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto relative w-full overflow-hidden flex flex-col">
      <BackgroundAnimation />
      
      <div className="relative z-10 w-full">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/20">
              <Zap className="w-8 h-8 text-emerald-500 fill-emerald-500" />
            </div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
              JD to Resume Maker
            </h1>
          </div>
          <p className="text-xl text-muted max-w-2xl">
            Tailor your existing resume bullets and skills to match any job description perfectly in seconds.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: UI */}
          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <label className="text-sm font-black uppercase tracking-widest text-emerald-500/80">1. Select Target Resume</label>
                <span className="text-xs text-muted font-medium">{resumes.length} available</span>
              </div>
              <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto p-1 pr-2 custom-scrollbar">
                {resumes.length === 0 ? (
                  <div className="p-8 bg-card/20 border-2 border-dashed border-border rounded-2xl text-center">
                    <p className="text-muted text-sm">No resumes found. Create one first!</p>
                  </div>
                ) : (
                  resumes.map(resume => (
                    <button
                      key={resume.id}
                      onClick={() => setSelectedResumeId(resume.id)}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${
                        selectedResumeId === resume.id 
                        ? 'bg-emerald-500/10 border-emerald-500 shadow-xl shadow-emerald-500/10' 
                        : 'bg-card/40 border-border hover:border-emerald-500/30'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedResumeId === resume.id ? 'bg-emerald-500/20' : 'bg-muted/50 group-hover:bg-emerald-500/10'} transition-colors`}>
                        <FileText className={`w-5 h-5 ${selectedResumeId === resume.id ? 'text-emerald-500' : 'text-muted'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`block font-bold truncate ${selectedResumeId === resume.id ? 'text-foreground' : 'text-muted group-hover:text-foreground'}`}>
                          {resume.title}
                        </span>
                        <span className="text-[10px] text-muted/60 uppercase font-black">Last updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                      </div>
                      {selectedResumeId === resume.id && (
                        <motion.div layoutId="active-check" className="bg-emerald-500 rounded-full p-1 shadow-lg">
                           <Check className="w-3 h-3 text-emerald-950 stroke-[4px]" />
                        </motion.div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <label className="text-sm font-black uppercase tracking-widest text-emerald-400">2. Paste Job Description</label>
              </div>
              <div className="relative group">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here... 
AI will use this to optimize your bullet points and suggest relevant keywords."
                  className="w-full h-64 bg-card/30 backdrop-blur-xl border-2 border-border rounded-3xl p-8 text-lg focus:outline-none focus:border-emerald-500/50 transition-all resize-none shadow-2xl group-hover:bg-card/40"
                />
                <div className="absolute bottom-6 right-6 flex items-center gap-2 text-[10px] text-emerald-500/50 font-black uppercase tracking-tighter bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10 backdrop-blur-md">
                   <Brain className="w-3 h-3" /> Powered by Gemini 2.5 Flash
                </div>
              </div>
            </section>

            <button
              onClick={handleTailor}
              disabled={!selectedResumeId || !jobDescription.trim() || isGenerating}
              className="w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-emerald-950 font-black text-xl rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-emerald-500/20 group uppercase tracking-widest"
            >
              {isGenerating ? (
                <>AI is Tailoring... <Loader2 className="w-6 h-6 animate-spin" /></>
              ) : (
                <>Optimize My Resume <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
              )}
            </button>
          </div>

          {/* Right Column: Information / Tease */}
          <div className="hidden lg:flex flex-col gap-6">
             <div className="bg-gradient-to-br from-emerald-500/10 via-background to-teal-500/10 border-2 border-emerald-500/20 rounded-3xl p-8 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
                <div className="relative z-10">
                   <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 mx-auto border-2 border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-12 h-12 text-emerald-400" />
                   </div>
                   <h3 className="text-3xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">The AI Advantage</h3>
                   <div className="space-y-4 max-w-sm">
                      <DetailIcon label="ATS Keyword Injection" desc="Automatically maps keywords from the JD to your experience." />
                      <DetailIcon label="Bullet Point Optimization" desc="Turns generic tasks into high-impact, JD-specific results." />
                      <DetailIcon label="Skill Gap Discovery" desc="Identifies and suggests critical skills you might have missed." />
                   </div>
                </div>
                {/* Decorative glow */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
             </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-8"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full shadow-[0_0_80px_-12px_rgba(16,185,129,0.3)]"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Brain className="w-16 h-16 text-emerald-500" />
              </motion.div>
            </div>
            <motion.h2 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500"
            >
              TAILORING YOUR FUTURE
            </motion.h2>
            <p className="text-muted mt-4 font-bold tracking-widest uppercase">Connecting your story to the opportunity...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-8 py-4 rounded-2xl font-black shadow-2xl animate-bounce z-[200]">
          {error}
        </div>
      )}
    </main>
  );
}

function DetailIcon({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex flex-col items-center gap-1 group/item">
      <span className="text-foreground font-black uppercase text-xs tracking-widest group-hover/item:text-emerald-400 transition-colors">{label}</span>
      <span className="text-muted text-xs font-medium opacity-80">{desc}</span>
    </div>
  );
}
