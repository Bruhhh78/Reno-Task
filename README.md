# Notice Board — Reno Platforms Internship Assignment

**Live Demo:** [https://reno-notice-task.vercel.app/](https://reno-notice-task.vercel.app/)  
**GitHub Repository:** [https://github.com/Bruhhh78/Reno-Task](https://github.com/Bruhhh78/Reno-Task)

A full-stack Notice Board web application built with **Next.js (Pages Router)**, **Prisma ORM**, and **Supabase (PostgreSQL)**, deployed on **Vercel**.

---

## 🚀 Features

- **Full CRUD** — Create, Read, Update, Delete notices
- **Urgent-first ordering** via Prisma `orderBy` (not client-side sorting)
- **Server-side validation** in all API routes
- **Responsive** card grid (mobile + desktop)
- **Delete confirmation** dialog
- **Optional image** URL on each notice
- **Dark, premium UI** with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (Pages Router) |
| ORM | Prisma |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel (free Hobby tier) |
| Styling | Tailwind CSS |
| Language | TypeScript |

---

## ⚙️ Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/reno-notice-board.git
cd reno-notice-board/notice-board
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgmode=require"
```

Get your connection string from:  
**Supabase → Project → Settings → Database → Connection string → URI mode**  
(Use the **Transaction mode (port 6543)** URL for serverless/Vercel compatibility)

### 4. Run Prisma migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
notice-board/
├── prisma/
│   └── schema.prisma        # Notice model + enums
├── lib/
│   └── prisma.ts            # Prisma client singleton
├── components/
│   ├── NoticeCard.tsx       # Card with Edit/Delete
│   ├── NoticeForm.tsx       # Shared Add/Edit form
│   └── ConfirmDialog.tsx    # Delete confirmation modal
├── pages/
│   ├── index.tsx            # Notice list (SSR)
│   ├── add.tsx              # Add notice page
│   ├── edit/[id].tsx        # Edit notice page (SSR)
│   └── api/notices/
│       ├── index.ts         # GET + POST
│       └── [id].ts          # PUT + DELETE
└── styles/
    └── globals.css
```

---

## 🌐 Deploying to Vercel

1. Push to a **public GitHub repository**
2. Import the project in [vercel.com](https://vercel.com)
3. Set `Root Directory` to `notice-board`
4. Add `DATABASE_URL` in **Vercel → Settings → Environment Variables**
5. Deploy → run `npx prisma migrate deploy` in Vercel's post-build or via Supabase SQL editor

---

## 💡 One Thing I Would Improve

With more time, I would add **real-time updates** using Supabase Realtime subscriptions — so when one user posts or deletes a notice, all other viewers see the change instantly without a page refresh.

---

## 🤖 AI Usage

AI (Google Gemini / Antigravity) was used to:
- Scaffold the initial project structure and boilerplate files
- Generate component and page templates
- Suggest Prisma schema design and API route patterns

All AI-generated code was reviewed, understood, and adapted. The core logic (validation rules, ordering strategy, API design decisions) was directed by me based on the assignment requirements.

---

## ✅ Pre-Submission Checklist

- [ ] Vercel URL is live and publicly accessible (no login required)
- [ ] GitHub repository is public with meaningful commit history
- [ ] Both links submitted on Internshala
- [ ] All CRUD operations tested end-to-end
- [ ] Server-side validation confirmed
- [ ] Urgent notices appear first with red badge
- [ ] Delete requires confirmation
- [ ] Mobile responsive layout verified
