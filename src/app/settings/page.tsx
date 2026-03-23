"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  LogOut,
  Mail,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";

const SETTINGS_TABS = [
  { id: "account", label: "My Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  // Mock State
  const [theme, setTheme] = useState("dark");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Handle setting theme with persistence
  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <div className="flex-1 relative overflow-x-hidden overflow-y-auto bg-background p-6 lg:p-10 flex flex-col md:flex-row gap-8 z-0">
      <BackgroundAnimation variant="settings" />
      
      {/* Settings Navigation Sidebar */}
      <div className="w-full md:w-64 shrink-0 space-y-2 relative z-10">
        <div className="mb-6 px-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted mt-1 text-sm">Manage preferences and account</p>
        </div>

        <nav className="space-y-1">
          {SETTINGS_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-muted hover:text-foreground hover:bg-card border border-transparent hover:border-border"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="pt-8 px-2">
          <button className="w-full flex items-center justify-between text-red-500 hover:text-red-400 font-medium text-sm transition-colors group p-2">
            <span className="flex items-center gap-2">
              <LogOut className="w-5 h-5" /> Sign Out
            </span>
          </button>
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 max-w-3xl relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[500px]"
          >
            {activeTab === "account" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-border/50 pb-4">Personal Information</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    S
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Shivam Sharma</h3>
                    <p className="text-sm text-muted mb-2">shivam@example.com</p>
                    <button className="text-xs bg-background border border-border px-3 py-1.5 rounded-lg hover:border-primary transition-colors">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Full Name</label>
                    <input type="text" defaultValue="Shivam Sharma" className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Email Address</label>
                    <input type="email" defaultValue="shivam@example.com" disabled className="w-full bg-background border border-border rounded-lg px-4 py-2 opacity-50 cursor-not-allowed" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold border-b border-border/50 pb-4 mt-8 pt-4">Connected Accounts</h2>
                <div className="flex items-center justify-between bg-background border border-border p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0A66C2] rounded-lg flex items-center justify-center text-white font-bold">in</div>
                    <div>
                      <h4 className="font-semibold text-sm">LinkedIn</h4>
                      <p className="text-xs text-muted">Used for Peer Review verification</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-muted border border-border px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    Disconnect
                  </button>
                </div>
                
                <div className="pt-6 border-t border-border/50 mt-8">
                  <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-border/50 pb-4">Theme Preferences</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div 
                    onClick={() => handleSetTheme('dark')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-muted'}`}
                  >
                    <div className="h-20 bg-zinc-900 rounded-lg border border-zinc-800 mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><CheckCircle2 className={`w-5 h-5 ${theme === 'dark' ? 'text-primary' : 'text-transparent'}`} /></div>
                    </div>
                    <p className="text-center font-medium">Dark Mode</p>
                  </div>
                  <div 
                    onClick={() => handleSetTheme('light')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-muted'}`}
                  >
                    <div className="h-20 bg-zinc-100 rounded-lg border border-zinc-300 mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><CheckCircle2 className={`w-5 h-5 ${theme === 'light' ? 'text-primary' : 'text-transparent'}`} /></div>
                    </div>
                    <p className="text-center font-medium">Light Mode</p>
                  </div>
                  <div 
                    onClick={() => handleSetTheme('system')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-muted'}`}
                  >
                    <div className="h-20 bg-gradient-to-r from-zinc-900 to-zinc-100 rounded-lg border border-border mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><CheckCircle2 className={`w-5 h-5 ${theme === 'system' ? 'text-primary' : 'text-transparent'}`} /></div>
                    </div>
                    <p className="text-center font-medium">System</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-border/50 pb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 text-muted mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Email Notifications</h4>
                        <p className="text-xs text-muted">Receive updates about your job applications and peer reviews.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                    <div className="flex gap-3">
                      <Smartphone className="w-5 h-5 text-muted mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Push Notifications</h4>
                        <p className="text-xs text-muted">Get immediate alerts when someone reviews your resume.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-red-500 border-b border-red-500/20 pb-4">Danger Zone</h2>
                <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-4">
                  <h4 className="font-semibold text-red-500 mb-1">Delete Account</h4>
                  <p className="text-sm text-red-400/80 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
            
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
