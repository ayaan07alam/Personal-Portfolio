# 🚀 Portfolio Website - Setup Guide

## Step 1: Install Dependencies

Open your terminal in the `portfolio-website` folder and run:

```bash
npm install
```

This will install all the required packages (Next.js, React, Supabase, Framer Motion, etc.).

## Step 2: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (it's free!)
3. Click "New Project"
4. Fill in:
   - **Name**: `portfolio` (or any name you like)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
5. Click "Create new project" and wait ~2 minutes

## Step 3: Get Supabase Credentials

1. In your Supabase project, click on the **Settings** icon (gear) in the sidebar
2. Click on **API** in the settings menu
3. You'll see:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
4. Copy these two values

## Step 4: Create Environment File

1. In the `portfolio-website` folder, create a file called `.env.local`
2. Paste this and replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**IMPORTANT**: Replace the placeholder values with your actual Supabase URL and key!

## Step 5: Create Database Tables

1. In your Supabase project, click on the **SQL Editor** in the sidebar
2. Click "New query"
3. Copy the ENTIRE contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click "Run" (or press Ctrl/Cmd + Enter)
6. You should see "Success! No rows returned"

## Step 6: Create Storage Bucket

1. In Supabase, click on **Storage** in the sidebar
2. Click "Create a new bucket"
3. Name it `portfolio-images`
4. Make it **Public**
5. Click "Create bucket"

## Step 7: Create Admin User

1. In Supabase, click on **Authentication** in the sidebar
2. Click "Add user" → "Create new user"
3. Enter:
   - **Email**: your email (e.g., `admin@example.com`)
   - **Password**: create a strong password
4. Click "Create user"

**Save these credentials!** You'll use them to log into the admin panel.

## Step 8: Run the Website!

In your terminal, run:

```bash
npm run dev
```

Then open your browser to [http://localhost:3000](http://localhost:3000)

🎉 **You should see your portfolio website!**

## Step 9: Log into Admin Panel

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter the email and password you created in Step 7
3. Click "Sign In"

You're now in the admin dashboard! 🎊

## Step 10: Edit Your Portfolio

Now you can edit every section:

1. Click on any section (Hero, About, Skills, etc.)
2. Fill in your information
3. Upload images
4. Click "Save Changes"
5. Visit [http://localhost:3000](http://localhost:3000) to see your changes!

## Troubleshooting

### "Cannot connect to Supabase"
- Check your `.env.local` file has the correct URL and key
- Make sure you ran the SQL migration (Step 5)
- Restart the dev server (`npm run dev`)

### "Admin login not working"
- Double-check you created the user in Supabase (Step 7)
- Make sure you're using the exact email and password
- Check browser console for errors

### "Image upload not working"
- Make sure you created the `portfolio-images` bucket (Step 6)
- Make sure it's set to **Public**
- Check Supabase Storage permissions

### "Lint errors in VS Code"
- These are normal before running `npm install`
- They'll disappear after installing dependencies

## Next Steps

### Deploy to Vercel (FREE!)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

Your portfolio will be live in ~2 minutes! 🚀

### Customize Design

- **Colors**: Edit `tailwind.config.ts`
- **Global styles**: Edit `app/globals.css`
- **Font**: Change in `app/layout.tsx`

## Tips

- Update content through the admin panel - no coding needed!
- All images are automatically optimized
- The site is SEO-ready out of the box
- Free to host on Vercel forever!

---

Need help? Check the README.md file for more information!
