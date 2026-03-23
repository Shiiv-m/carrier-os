"use client";

import { useState, useEffect } from "react";
import { fetchTopGithubRepos } from "@/lib/sync-engine";
import { summarizeGithubRepos, extractLinkedInProfile } from "@/lib/gemini";
import { useResumes } from "@/hooks/useResumes";
import { Loader2, Github, Linkedin, CheckCircle2, FileText, ArrowRight, CloudSync } from "lucide-react";
import Link from "next/link";
import { Experience } from "@/types/resume";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";

export default function SourceCenter() {
  const { resumes, saveResume } = useResumes();
  
  const [githubUser, setGithubUser] = useState("");
  const [linkedinText, setLinkedinText] = useState("");
  
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [isSyncingLinkedin, setIsSyncingLinkedin] = useState(false);
  
  const [extractedData, setExtractedData] = useState<Experience[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    const savedGithub = localStorage.getItem("sync_githubUser");
    const savedLinkedin = localStorage.getItem("sync_linkedinText");
    if (savedGithub) setGithubUser(savedGithub);
    if (savedLinkedin) setLinkedinText(savedLinkedin);
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleGithubSync = async () => {
    if (!githubUser) return;
    localStorage.setItem("sync_githubUser", githubUser);
    setIsSyncingGithub(true);
    try {
      const repos = await fetchTopGithubRepos(githubUser);
      const stringified = JSON.stringify(repos);
      const entries = await summarizeGithubRepos(stringified);
      setExtractedData(entries);
      showNotification('success', 'GitHub data parsed successfully!');
    } catch (error) {
      showNotification('error', 'Failed to fetch or parse GitHub data.');
    } finally {
      setIsSyncingGithub(false);
    }
  };

  const handleLinkedinSync = async () => {
    if (!linkedinText) return;
    localStorage.setItem("sync_linkedinText", linkedinText);
    setIsSyncingLinkedin(true);
    try {
      const entries = await extractLinkedInProfile(linkedinText);
      setExtractedData(entries);
      showNotification('success', 'LinkedIn data parsed successfully!');
    } catch (error) {
      showNotification('error', 'Failed to sync LinkedIn data.');
    } finally {
      setIsSyncingLinkedin(false);
    }
  };

  const appendToResume = () => {
    if (!selectedResumeId || extractedData.length === 0) return;
    const resume = resumes.find(r => r.id === selectedResumeId);
    if (!resume) return;

    // Map extracted data to conform strictly to Experience type
    const newExperiences: Experience[] = extractedData.map(d => ({
       id: crypto.randomUUID(),
       company: d.company,
       position: d.position,
       startDate: d.startDate,
       endDate: d.endDate,
       current: d.endDate?.toLowerCase() === "present",
       description: d.description
    }));

    saveResume({
      ...resume,
      experience: [...resume.experience, ...newExperiences]
    });
    
    showNotification('success', 'Projects successfully appended to resume!');
    setExtractedData([]);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full relative z-0">
      <BackgroundAnimation variant="source" />
      
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg font-medium animate-in slide-in-from-top-4 flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
          {notification.message}
        </div>
      )}
      
      <header className="mb-12 relative z-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Source Center
        </h1>
        <p className="text-muted mt-2">Connect your professional platforms to automatically draft highly-tailored resume entries.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* GitHub Integration */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-8 h-8 text-foreground" />
            <h2 className="text-2xl font-semibold">GitHub Repo Sync</h2>
          </div>
          <p className="text-sm text-muted mb-6">Fetches your top 3 most starred repositories and generates 3-bullet-point ATS resume entries.</p>
          
          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Enter GitHub Username..."
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
            />
            <button 
              onClick={handleGithubSync}
              disabled={isSyncingGithub || !githubUser}
              className="flex items-center justify-center gap-2 bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 px-4 py-3 rounded-lg font-medium transition-colors"
            >
              {isSyncingGithub ? <Loader2 className="w-5 h-5 animate-spin" /> : <CloudSync className="w-5 h-5" />}
              {isSyncingGithub ? "Analyzing Repositories..." : "Sync GitHub"}
            </button>
          </div>
        </section>

        {/* LinkedIn Integration */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Linkedin className="w-8 h-8 text-[#0A66C2]" />
            <h2 className="text-2xl font-semibold">LinkedIn Parser</h2>
          </div>
          <p className="text-sm text-muted mb-6">Paste your LinkedIn profile text or copy-paste experience sections to convert them perfectly.</p>
          
          <div className="flex flex-col gap-4 h-full">
            <textarea 
              placeholder="Paste LinkedIn Profile text here..."
              value={linkedinText}
              onChange={(e) => setLinkedinText(e.target.value)}
              className="w-full h-32 bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <button 
              onClick={handleLinkedinSync}
              disabled={isSyncingLinkedin || !linkedinText}
              className="flex items-center justify-center gap-2 bg-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2]/30 disabled:opacity-50 px-4 py-3 rounded-lg font-medium transition-colors"
            >
              {isSyncingLinkedin ? <Loader2 className="w-5 h-5 animate-spin" /> : <CloudSync className="w-5 h-5" />}
              {isSyncingLinkedin ? "Extracting Data..." : "Parse LinkedIn"}
            </button>
          </div>
        </section>

      </div>

      {/* Extracted Data Results */}
      {extractedData.length > 0 && (
        <section className="mt-12 bg-background border border-border rounded-xl p-6 animate-in slide-in-from-bottom-4 relative z-10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" /> Parsed Results ready!
          </h2>
          
          <div className="grid gap-4 mb-8 max-h-96 overflow-y-auto pr-2">
             {extractedData.map((data, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-4">
                   <div className="font-semibold text-lg">{data.position}</div>
                   <div className="text-primary text-sm mb-2">{data.company} | {data.startDate} - {data.endDate}</div>
                   <div className="text-muted text-sm whitespace-pre-wrap">{data.description}</div>
                </div>
             ))}
          </div>

          <div className="p-6 bg-card border border-primary/20 rounded-xl flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-muted mb-2">Append exactly to Resume:</label>
              <select 
                className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
              >
                <option value="">-- Select a Resume --</option>
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.title} (Updated {new Date(r.updatedAt).toLocaleDateString()})</option>
                ))}
              </select>
            </div>
            <button 
              onClick={appendToResume}
              disabled={!selectedResumeId}
              className="w-full sm:w-auto mt-6 sm:mt-[28px] shrink-0 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add to Resume <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
