"use client";

import { Resume, Experience } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { refineExperienceDescription } from "@/lib/gemini";

export default function ExperienceForm({ resume, onChange }: { resume: Resume, onChange: (r: Resume) => void }) {
  const [refiningId, setRefiningId] = useState<string | null>(null);

  const handleAdd = () => {
    const newExp: Experience = {
      id: uuidv4(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onChange({
      ...resume,
      experience: [...resume.experience, newExp],
    });
  };

  const handleUpdate = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...resume,
      experience: resume.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    });
  };

  const handleRemove = (id: string) => {
    onChange({
      ...resume,
      experience: resume.experience.filter((exp) => exp.id !== id),
    });
  };

  const handleRefine = async (id: string, description: string) => {
    if (!description.trim()) return;
    setRefiningId(id);
    try {
      // In a real scenario we'd pass the JD here if available, but for now we refine generally
      const refinedText = await refineExperienceDescription(description);
      handleUpdate(id, "description", refinedText);
    } catch (error) {
      alert("Failed to refine bullet points.");
    } finally {
      setRefiningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Experience</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {resume.experience.map((exp) => (
          <div key={exp.id} className="bg-card border border-border rounded-xl p-6 relative group">
            <button
              onClick={() => handleRemove(exp.id)}
              className="absolute top-4 right-4 text-muted hover:text-red-500 p-2 rounded-md transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Company</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  value={exp.company}
                  onChange={(e) => handleUpdate(exp.id, "company", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Position</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  value={exp.position}
                  onChange={(e) => handleUpdate(exp.id, "position", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Start Date</label>
                <input
                  type="text"
                  placeholder="e.g. Jan 2023"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  value={exp.startDate}
                  onChange={(e) => handleUpdate(exp.id, "startDate", e.target.value)}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-muted">End Date</label>
                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input 
                      type="checkbox" 
                      className="accent-primary"
                      checked={exp.current}
                      onChange={(e) => handleUpdate(exp.id, "current", e.target.checked)}
                    />
                    Current Role
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Dec 2024"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  value={exp.endDate}
                  disabled={exp.current}
                  onChange={(e) => handleUpdate(exp.id, "endDate", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-muted">Description (Bullet points)</label>
                  <button
                    onClick={() => handleRefine(exp.id, exp.description)}
                    disabled={refiningId === exp.id || !exp.description.trim()}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                  >
                    {refiningId === exp.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-purple-500" />
                    )}
                    Refine with AI
                  </button>
                </div>
                <textarea
                  rows={4}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors whitespace-pre-wrap"
                  value={exp.description}
                  onChange={(e) => handleUpdate(exp.id, "description", e.target.value)}
                  placeholder="• Developed a new feature...&#10;• Improved performance by 20%..."
                />
              </div>
            </div>
          </div>
        ))}
        {resume.experience.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted">No experience entries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
