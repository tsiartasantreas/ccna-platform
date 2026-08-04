# Supabase Setup Guide

## Running the Database Migration

The migration SQL needs to be run through the Supabase Dashboard SQL Editor.

### Steps:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/jhesstimsojwmkdysmpy)
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `migrations/001_initial_schema.sql`
5. Click **Run** to execute the migration

### What the migration creates:

- **profiles** table — User profile data (display name, language, theme, plan)
- **lesson_progress** table — Per-lesson completion tracking
- **quiz_scores** table — Quiz attempt history with scores
- **user_points** table — Points, streaks, achievements
- **Row Level Security (RLS)** policies for all tables
- **Triggers** for auto-creating profiles on signup
- **Indexes** for performance

### After migration:

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider (already enabled by default)
3. Optionally enable **Google** OAuth provider
4. Set the **Site URL** to your deployed domain

### Environment Variables

Already configured in `.env`:
```
PUBLIC_SUPABASE_URL=https://jhesstimsojwmkdysmpy.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sb_publishable_bKD9biIulcfC5iNipD-8IA_3Zu4bmWD
```
