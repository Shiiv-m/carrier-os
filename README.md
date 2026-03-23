<div align="center">
  <h1>🚀 Career OS</h1>
  <p><strong>The all-in-one operating system for the modern job seeker.</strong></p>
  <p>Track your job hunt, get your resumes scanned by AI, engage with a highly competitive review community, and climb the professional global ranks—all in one place.</p>
</div>

---

## 🔥 Key Features

### 1. **AI ATS Health Bar & Resume Refiner**
Stop guessing what ATS bots want. Career OS analyzes your resume against any Job Description in real-time, highlighting exact missing keyword requirements. Hover over any experience bullet and hit *Refine* to unleash the Google Gemini 2.5 AI, automatically rewriting vague sentences into precise, metric-driven wins.

### 2. **Application Kanban Tracker**
Never lose track of an open application again. Our drag-and-drop Trello-style board lets you move your ongoing applications between `Saved`, `Applied`, `Interviewing`, `Offer`, and `Rejected` columns natively. Say goodbye to messy Excel sheets.

### 3. **Gamified Peer Review Hub**
Share your resume securely and anonymously to get immediate peer feedback. Review others, earn Karma, and climb the Leaderboards. Ranks trigger custom podium glowing animations and exclusive title badges that follow your profile across the site. Will you make it to the Top 1%?

### 4. **Professional Network Feed**
Scroll through a hybrid LinkedIn/Instagram style social feed built exclusively for career development. Share updates, native full-width images, and embedded video clips of your latest side projects to a dedicated audience.

### 5. **Inter-User Global Chat**
Found someone with great feedback or a matching role? Navigate straight into an integrated Messaging/Chat client directly from their Public Profile, complete with unread indicators and online statuses.

### 6. **Dynamic Public Profiles & WYSIWYG Editing**
Forget messy forms. Edit your own profile visually exactly as others will see it (What You See Is What You Get) via transparent inline inputs. Upload your personal Banner and Avatar using native Drag-and-Drop functionality. When you rank up on the global Leaderboard, watch as your very own profile editor transforms, surrounding you with gold medals and podium glows!

## 💻 Tech Stack
- **Framework**: `Next.js 14` (App Router)
- **Styling**: `Tailwind CSS` & `Framer Motion` (Procedural complex glowing states and layer variants)
- **Icons**: `Lucide React`
- **AI Integration**: `Google Gemini 2.5 Flash API` (Server Actions)

---

## 🛠️ Getting Started

First, ensure you have the required environment variables. Create a `.env.local` file at the root of the project:
```bash
GEMINI_API_KEY="your-gemini-api-key"
```

Then, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch your new Career OS.

## 🔮 Roadmap
- Integrations for direct LinkedIn and GitHub account scraping (`/sync`).
- Implementation of full OAuth Authentication.
- Live database mappings leveraging `Supabase` to persist the actual Gamification Ranks globally.
