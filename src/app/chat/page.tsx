"use client";

import { useState } from "react";
import { Send, Search, Phone, Video, MoreVertical, Image as ImageIcon, Paperclip, CheckCircle2 } from "lucide-react";

const CONTACTS = [
  { id: "1", name: "Sarah Chen", role: "Product Designer @ Google", avatar: "S", online: true, lastMessage: "That sounds great, let's connect tomorrow!", time: "10:42 AM", unread: 2 },
  { id: "2", name: "David Kim", role: "Frontend Developer", avatar: "D", online: false, lastMessage: "Thanks for the feedback on my portfolio.", time: "Yesterday", unread: 0 },
  { id: "3", name: "Sarah Johnson", role: "Technical Recruiter @ Stripe", avatar: "S", online: true, lastMessage: "Are you free for a quick introductory call?", time: "Mon", unread: 1 },
  { id: "4", name: "Emily Clark", role: "UX Researcher", avatar: "E", online: false, lastMessage: "I just sent over the Figma file link.", time: "Sun", unread: 0 },
];

const INITIAL_MESSAGES = [
  { id: "m1", senderId: "1", text: "Hey! I saw your profile on the Community Hub.", time: "10:30 AM" },
  { id: "m2", senderId: "me", text: "Hi Sarah! Nice to meet you. Yes, I've been active there recently.", time: "10:35 AM" },
  { id: "m3", senderId: "1", text: "Your resume structure looks fantastic. I'm actually looking to refer a Senior Engineer to our team. Would you be open to a chat?", time: "10:40 AM" },
  { id: "m4", senderId: "me", text: "I'd love that! I am currently open to new opportunities.", time: "10:41 AM" },
  { id: "m5", senderId: "1", text: "That sounds great, let's connect tomorrow!", time: "10:42 AM" },
];

export default function ChatPage() {
  const [activeContactId, setActiveContactId] = useState("1");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState("");

  const activeContact = CONTACTS.find(c => c.id === activeContactId);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now().toString(), senderId: "me", text: newMessage, time: "Just now" }
    ]);
    setNewMessage("");
  };

  return (
    <div className="flex-1 overflow-hidden flex bg-background p-4 sm:p-6 lg:p-8">
      <div className="flex-1 flex max-w-6xl mx-auto w-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        
        {/* Left Sidebar - Contacts List */}
        <div className="w-full md:w-80 border-r border-border flex flex-col hidden md:flex">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {CONTACTS.map(contact => (
              <div 
                key={contact.id}
                onClick={() => setActiveContactId(contact.id)}
                className={`p-4 flex gap-3 cursor-pointer transition-colors border-l-2 ${activeContactId === contact.id ? 'bg-primary/5 hover:bg-primary/10 border-primary' : 'border-transparent hover:bg-white/5'}`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-white font-bold">
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-semibold text-sm truncate">{contact.name}</h4>
                    <span className="text-[10px] text-muted whitespace-nowrap ml-2">{contact.time}</span>
                  </div>
                  <p className="text-xs text-muted truncate pr-4">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white shrink-0 self-center">
                    {contact.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Area - Active Chat */}
        {activeContact ? (
          <div className="flex-1 flex flex-col bg-background">
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-border flex justify-between items-center bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-white font-bold">
                  {activeContact.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">{activeContact.name}</h3>
                  <p className="text-xs text-muted flex items-center gap-1">
                    {activeContact.online ? <span className="text-green-500">● Online</span> : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted">
                <Phone className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
                <Video className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
                <MoreVertical className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="text-center text-xs text-muted my-4">
                Today
              </div>
              
              {messages.map(msg => {
                const isMe = msg.senderId === "me";
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${isMe ? 'order-2' : ''}`}>
                      <div className={`px-4 py-2.5 rounded-2xl ${
                        isMe 
                          ? 'bg-primary text-white rounded-br-sm' 
                          : 'bg-card border border-border text-foreground rounded-bl-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <div className={`text-[10px] text-muted mt-1.5 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {msg.time}
                        {isMe && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-card border-t border-border">
              <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 focus-within:border-primary transition-colors">
                <button className="text-muted hover:text-foreground transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="text-muted hover:text-foreground transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  placeholder="Write a message..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 py-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white disabled:opacity-50 transition-opacity"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background text-muted">
            Select a conversation to start messaging
          </div>
        )}

      </div>
    </div>
  );
}
