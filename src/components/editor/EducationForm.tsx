"use client";

import { Resume, Education } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2 } from "lucide-react";

export default function EducationForm({ resume, onChange }: { resume: Resume, onChange: (r: Resume) => void }) {
  const handleAdd = () => {
    const newEdu: Education = {
      id: uuidv4(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
    };
    onChange({
      ...resume,
      education: [...resume.education, newEdu],
    });
  };

  const handleUpdate = (id: string, field: keyof Education, value: any) => {
    onChange({
      ...resume,
      education: resume.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    });
  };

  const handleRemove = (id: string) => {
    onChange({
      ...resume,
      education: resume.education.filter((edu) => edu.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Education</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      <div className="space-y-6">
        {resume.education.map((edu) => (
          <div key={edu.id} className="bg-card border border-border rounded-xl p-6 relative group">
            <button
              onClick={() => handleRemove(edu.id)}
              className="absolute top-4 right-4 text-muted hover:text-red-500 p-2 rounded-md transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Institution</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  value={edu.institution}
                  onChange={(e) => handleUpdate(edu.id, "institution", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Degree</label>
                <input
                  type="text"
                  placeholder="e.g. B.S., M.A."
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  value={edu.degree}
                  onChange={(e) => handleUpdate(edu.id, "degree", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted mb-1">Field of Study</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleUpdate(edu.id, "fieldOfStudy", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Start Date</label>
                <input
                  type="text"
                  placeholder="e.g. Sep 2019"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  value={edu.startDate}
                  onChange={(e) => handleUpdate(edu.id, "startDate", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">End Date</label>
                <input
                  type="text"
                  placeholder="e.g. May 2023"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  value={edu.endDate}
                  onChange={(e) => handleUpdate(edu.id, "endDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        {resume.education.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted">No education entries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
