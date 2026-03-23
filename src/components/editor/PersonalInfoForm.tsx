"use client";

import { Resume } from "@/types/resume";
import { UserCircle } from "lucide-react";

export default function PersonalInfoForm({ resume, onChange }: { resume: Resume, onChange: (r: Resume) => void }) {
  const handleChange = (field: keyof Resume["personalInfo"], value: string) => {
    onChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
  };

  const handleAutoFill = () => {
    const data = localStorage.getItem("donedone_profile");
    if (data) {
      try {
        const p = JSON.parse(data);
        onChange({
          ...resume,
          personalInfo: {
            ...resume.personalInfo,
            fullName: p.name || resume.personalInfo.fullName,
            email: p.email || resume.personalInfo.email,
            phone: p.phone || resume.personalInfo.phone,
            location: p.address || resume.personalInfo.location,
          }
        });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Personal Details</h2>
        <button 
          onClick={handleAutoFill}
          className="flex items-center justify-center gap-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors font-medium border border-primary/20"
        >
          <UserCircle className="w-4 h-4" /> Auto-fill from Profile
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Full Name</label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
            value={resume.personalInfo.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Email</label>
          <input
            type="email"
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
            value={resume.personalInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Phone</label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
            value={resume.personalInfo.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Location</label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
            value={resume.personalInfo.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Website URL</label>
          <input
            type="url"
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
            value={resume.personalInfo.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">LinkedIn URL</label>
          <input
            type="url"
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
            value={resume.personalInfo.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
