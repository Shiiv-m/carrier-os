"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  MoreVertical, 
  Plus, 
  Trash2,
  Calendar,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Define the columns and their order
const COLUMNS = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"] as const;
type ColumnType = typeof COLUMNS[number];

interface Job {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ColumnType;
  location?: string;
  dateAdded: string;
  url?: string;
  salary?: string;
}

// Mock initial data
const INITIAL_JOBS: Job[] = [
  { id: "1", companyName: "Stripe", jobTitle: "Frontend Engineer", status: "Saved", location: "Remote", dateAdded: "2024-03-20" },
  { id: "2", companyName: "Vercel", jobTitle: "Senior React Developer", status: "Applied", location: "San Francisco, CA", dateAdded: "2024-03-18", salary: "$160k - $200k" },
  { id: "3", companyName: "Supabase", jobTitle: "Developer Advocate", status: "Interviewing", location: "Remote", dateAdded: "2024-03-15" },
  { id: "4", companyName: "Figma", jobTitle: "Product Designer", status: "Applied", dateAdded: "2024-03-19" },
  { id: "5", companyName: "Google", jobTitle: "Software Engineer III", status: "Offer", location: "Mountain View, CA", dateAdded: "2024-03-01", salary: "$210k + Equity" },
];

export default function KanbanBoard() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);

  const handleDragStart = (job: Job) => {
    setDraggedJob(job);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (status: ColumnType) => {
    if (!draggedJob) return;
    
    // Update the job status
    setJobs(jobs.map(job => 
      job.id === draggedJob.id ? { ...job, status } : job
    ));
    setDraggedJob(null);
  };

  const handleAddJob = (status: ColumnType) => {
    const newJob: Job = {
      id: uuidv4(),
      companyName: "New Company",
      jobTitle: "Role",
      status: status,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setJobs([newJob, ...jobs]);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobs(jobs.filter(j => j.id !== id));
  };

  // Helper function to get color mapping for columns
  const getColColor = (status: ColumnType) => {
    switch (status) {
      case "Saved": return "text-zinc-400 border-zinc-500 bg-zinc-500/10";
      case "Applied": return "text-blue-500 border-blue-500 bg-blue-500/10";
      case "Interviewing": return "text-purple-500 border-purple-500 bg-purple-500/10";
      case "Offer": return "text-green-500 border-green-500 bg-green-500/10";
      case "Rejected": return "text-red-500 border-red-500 bg-red-500/10";
      default: return "text-zinc-400 bg-zinc-500/10";
    }
  };

  return (
    <div className="flex gap-6 h-full min-h-[600px] w-max">
      {COLUMNS.map((column) => {
        const columnJobs = jobs.filter(j => j.status === column);
        
        return (
          <div 
            key={column} 
            className="w-80 flex flex-col bg-card/50 border border-border/50 rounded-2xl overflow-hidden shadow-sm"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column)}
          >
            {/* Column Header */}
            <div className={`p-4 border-b border-border/50 flex items-center justify-between shrink-0 ${getColColor(column).split(' ')[2]}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getColColor(column).split(' ')[1].replace('border-', 'bg-')}`} />
                <h3 className={`font-bold ${getColColor(column).split(' ')[0]}`}>{column}</h3>
                <span className="text-xs font-bold bg-background text-foreground px-2 py-0.5 rounded-full border border-border/50 shadow-sm">
                  {columnJobs.length}
                </span>
              </div>
              <button 
                onClick={() => handleAddJob(column)}
                className="text-muted hover:text-foreground transition-colors p-1 hover:bg-white/5 rounded-md"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Body / Cards */}
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
              <AnimatePresence>
                {columnJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    layoutId={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }} // Using Framer Motion "layoutId" for smooth drag and drop
                    draggable
                    onDragStart={() => handleDragStart(job)}
                    className="bg-card border border-border hover:border-primary/50 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground line-clamp-1 break-all">{job.jobTitle}</h4>
                      <button 
                        onClick={(e) => handleDelete(job.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-500 transition-opacity p-1 -mt-1 -mr-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted mb-3">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="font-medium text-zinc-300">{job.companyName}</span>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      {job.location && (
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </div>
                      )}
                      
                      {job.salary && (
                        <div className="inline-block bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-md border border-green-500/20 font-medium">
                          {job.salary}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(job.dateAdded).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1 text-primary cursor-pointer hover:underline font-medium">
                        Docs <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Drop Zone hint */}
              {draggedJob && draggedJob.status !== column && (
                <div className="h-24 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 flex items-center justify-center text-primary/50 text-sm font-medium">
                  Drop Here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
