"use client";

import { useState } from "react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Image as ImageIcon, 
  Video, 
  Smile, 
  Send 
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";
import Link from "next/link";

const makeSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

const MOCK_POSTS = [
  {
    id: "1",
    author: { name: "Emily Chen", role: "Product Designer @ Figma", avatar: "E", verified: true },
    timeAgo: "2h",
    content: "Just published a new case study on how we redesigned the component properties panel! If anyone is looking for Junior UX roles, our team is currently expanding. Let me know below or shoot me a DM! 👇✨",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=800&q=80",
    likes: 342,
    comments: 45,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    author: { name: "David Kim", role: "Frontend Developer | Open to Work", avatar: "D", verified: false },
    timeAgo: "5h",
    content: "After 3 months of hard work, I finally launched my portfolio built with Next.js and Framer Motion! Check it out and let me know your thoughts. #opentowork #frontend",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    likes: 128,
    comments: 12,
    isLiked: true,
    isSaved: true,
  },
  {
    id: "3",
    author: { name: "Sarah Johnson", role: "Technical Recruiter @ Stripe", avatar: "S", verified: true },
    timeAgo: "1d",
    content: "We are actively hiring for Senior Backend Engineers! If you have strong experience with Go and distributed systems, please apply through the link in my bio. We offer fully remote work globally. 🚀",
    likes: 890,
    comments: 156,
    isLiked: false,
    isSaved: false,
  }
];

export default function NetworkPage() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPostText, setNewPostText] = useState("");

  const toggleLike = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const toggleSave = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p));
  };

  const handlePost = () => {
    if (!newPostText.trim()) return;
    
    const newPost = {
      id: Date.now().toString(),
      author: { name: "Shivam Sharma", role: "Software Engineer", avatar: "S", verified: false },
      timeAgo: "Just now",
      content: newPostText,
      likes: 0,
      comments: 0,
      isLiked: false,
      isSaved: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
  };

  return (
    <div className="flex-1 relative overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-10 z-0">
      <BackgroundAnimation variant="network" />

      <div className="max-w-2xl mx-auto space-y-6 relative z-10 pb-20">
        
        {/* Create Post Composer */}
        <div className="bg-card border border-border shadow-sm rounded-2xl p-4">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-violet-500 flex items-center justify-center text-white font-bold shrink-0">
              S
            </div>
            <textarea 
              placeholder="What's happening in your career? Post an update, image, or video..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="flex-1 bg-transparent border-none resize-none focus:outline-none min-h-[60px] text-foreground placeholder:text-muted pt-2"
            />
          </div>
          
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button className="p-2 text-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors tooltip-trigger" title="Upload Image">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-muted hover:text-violet-400 hover:bg-violet-500/10 rounded-full transition-colors tooltip-trigger" title="Upload Video">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-muted hover:text-fuchsia-400 hover:bg-fuchsia-500/10 rounded-full transition-colors tooltip-trigger hidden sm:block">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={handlePost}
              disabled={!newPostText.trim()}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-white px-5 py-1.5 rounded-full font-medium flex items-center gap-2 transition-all shadow-md"
            >
              Post <Send className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Dynamic Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <motion.article 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={post.id} 
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Post Header */}
              <div className="p-4 flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  <Link href={`/u/${makeSlug(post.author.name)}`}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-white font-bold shrink-0 shadow-inner cursor-pointer hover:opacity-90">
                      {post.author.avatar}
                    </div>
                  </Link>
                  <div>
                    <h3 className="font-semibold text-foreground flex items-center gap-1.5 cursor-pointer hover:underline">
                      <Link href={`/u/${makeSlug(post.author.name)}`}>
                        {post.author.name}
                      </Link>
                      {post.author.verified && (
                        <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      )}
                      <span className="text-muted font-normal text-xs ml-1">• {post.timeAgo}</span>
                    </h3>
                    <p className="text-xs text-muted truncate max-w-[200px] sm:max-w-[400px]">
                      {post.author.role}
                    </p>
                  </div>
                </div>
                <button className="text-muted hover:bg-background p-2 rounded-full transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Text */}
              <div className="px-4 pb-3">
                <p className="text-sm sm:text-base text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Post Media Attachment */}
              {post.image && (
                <div className="w-full max-h-[500px] bg-black border-y border-border/50">
                  <img src={post.image} alt="Post attachment" className="w-full h-full object-contain max-h-[500px]" />
                </div>
              )}
              {post.video && (
                <div className="w-full max-h-[500px] bg-black border-y border-border/50">
                  <video src={post.video} controls className="w-full h-full max-h-[500px]" />
                </div>
              )}

              {/* Action Bar */}
              <div className="px-2 py-2 flex flex-col">
                {/* Stats */}
                <div className="px-3 pb-2 pt-1 flex justify-between text-xs text-muted border-b border-border/50">
                  <span>{post.likes} Likes</span>
                  <span>{post.comments} Comments</span>
                </div>
                
                {/* Buttons */}
                <div className="flexitems-center justify-between pt-1 flex">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${post.isLiked ? 'text-rose-500 hover:bg-rose-500/10' : 'text-muted hover:bg-background hover:text-foreground'}`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current text-rose-500' : ''}`} /> 
                      <span className="hidden sm:inline">Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm text-muted hover:bg-background hover:text-foreground transition-colors">
                      <MessageCircle className="w-5 h-5" /> 
                      <span className="hidden sm:inline">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm text-muted hover:bg-background hover:text-foreground transition-colors">
                      <Share2 className="w-5 h-5" /> 
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => toggleSave(post.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors ml-auto ${post.isSaved ? 'text-primary hover:bg-primary/10' : 'text-muted hover:bg-background hover:text-foreground'}`}
                  >
                    <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current text-primary' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </div>
  );
}
