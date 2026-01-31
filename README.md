# Personal Portfolio Website

A stunning, modern portfolio website with a full-featured admin dashboard. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## ⚡ Quick Start

### 1. Install Dependencies

```bash
cd portfolio-website
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Copy the project URL and anon key
4. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create Database Tables

Go to your Supabase SQL Editor and run the SQL migration file (see `supabase/migrations/001_initial_schema.sql`)

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your portfolio!

## 📁 Project Structure

```
portfolio-website/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   │   ├── hero/
│   │   ├── about/
│   │   ├── skills/
│   │   ├── experience/
│   │   ├── projects/
│   │   ├── education/
│   │   └── contact/
│   ├── login/             # Admin login page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Public portfolio homepage
│   └── globals.css        # Global styles
├── components/
│   ├── portfolio/         # Public portfolio components
│   └── admin/             # Admin dashboard components
├── lib/
│   ├── supabase/          # Supabase configuration
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript type definitions
└── supabase/
    └── migrations/        # Database migrations
```

## 🎨 Features

### Public Portfolio
- ✨ Stunning hero section with animated gradients
- 📝 About section with image and resume download
- 💼 Skills section with categorized progress bars
- 🚀 Work experience timeline
- 🎯 Projects showcase with images
- 🎓 Education history
- 📬 Contact information with social links
- 🌈 Glassmorphism UI effects
- ✨ Smooth scroll animations
- 📱 Fully responsive design

### Admin Dashboard
- 🔐 Secure authentication
- ✏️ Edit all portfolio sections
- 📤 Upload images to Supabase Storage
- 🎯 Drag-and-drop reordering
- 👁️ Real-time preview
- 🎨 User-friendly interface

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (Supabase URL and key)
5. Deploy!

Your portfolio will be live at `your-project.vercel.app`

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## 📝 Customization

### Update Portfolio Content

1. Log in to the admin dashboard at `/login`
2. Navigate to any section you want to edit
3. Make your changes
4. Save - changes appear immediately on the public site!

### Modify Design

- Colors: Edit `tailwind.config.ts`
- Global styles: Edit `app/globals.css`
- Component styles: Edit individual component files

## 💡 Tips

- All edits are done through the admin dashboard - no code changes needed!
- Images are automatically optimized by Next.js
- The site is SEO-optimized out of the box
- Free to host on Vercel (zero cost!)

## 🐛 Troubleshooting

**Lint errors showing?**
- Run `npm install` first - errors are just missing node_modules

**Can't connect to Supabase?**
- Check your `.env.local` file has correct credentials
- Make sure you've run the database migrations

**Admin login not working?**
- Create an admin user in Supabase Dashboard (Authentication > Users)

## 📄 License

MIT License - feel free to use this for your own portfolio!

---

Built with ❤️ using Next.js and Supabase
