"use client";

import Link from "next/link";
import { Plus, FileText, Trash2, Copy } from "lucide-react";
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
        <div className="bg-card border border-border px-4 py-2 rounded-lg text-sm text-muted flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           Last sync: <span className="text-foreground font-medium">Never</span>
        </div>
      </header>

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
        {/* Create New Card */}
        <motion.button
          variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
          onClick={handleCreateNew}
          className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-card/50 transition-all group"
        >
          <div className="bg-card w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <span className="mt-4 font-medium text-foreground">Create New</span>
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
