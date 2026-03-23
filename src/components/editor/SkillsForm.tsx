"use client";

import { Resume } from "@/types/resume";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { X, Plus } from "lucide-react";

export default function SkillsForm({ resume, onChange }: { resume: Resume, onChange: (r: Resume) => void }) {
  const [skillInput, setSkillInput] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("donedone_profile");
    if (data) {
      try {
        const p = JSON.parse(data);
        if (p.skills && Array.isArray(p.skills)) {
          setSuggestedSkills(p.skills);
        }
      } catch (e) {}
    }
  }, []);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      onChange({
        ...resume,
        skills: [...resume.skills, { id: uuidv4(), name: skillInput.trim() }],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (id: string) => {
    onChange({
      ...resume,
      skills: resume.skills.filter((s) => s.id !== id),
    });
  };

  const availableSuggestions = suggestedSkills.filter(
    s => !resume.skills.some(rs => rs.name.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Skills</h2>
      <div className="bg-background border border-border rounded-xl p-6">
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 bg-card border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            placeholder="e.g. React, TypeScript, ..."
          />
          <button 
             type="button" 
             onClick={() => {
                if (skillInput.trim()) {
                  onChange({
                    ...resume,
                    skills: [...resume.skills, { id: uuidv4(), name: skillInput.trim() }],
                  });
                  setSkillInput("");
                }
             }}
             className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors"
          >
             Add
          </button>
        </div>
        
        {availableSuggestions.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Suggested from Profile</p>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onChange({
                      ...resume,
                      skills: [...resume.skills, { id: uuidv4(), name: s }],
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:border-primary text-foreground rounded-full text-xs font-medium transition-colors"
                >
                  <Plus className="w-3 h-3 text-primary" /> {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {resume.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
            {resume.skills.map(skill => (
              <div key={skill.id} className="flex items-center gap-2 bg-primary/10 text-primary pl-3 pr-1 py-1 rounded-full border border-primary/30">
                <span className="text-sm font-medium">{skill.name}</span>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="hover:bg-primary/20 rounded-full p-1 transition-colors"
                  type="button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
