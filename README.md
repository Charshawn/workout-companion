# Workout Dashboard

A modern web dashboard for visualizing workout data from your Apple Watch Workout Companion app. Built with Next.js 14, TypeScript, and Supabase.

## Features

- 📊 **Real-time Stats** - View total workouts, exercises, and recent activity
- 📈 **Progress Charts** - Visualize weight progression and strength gains over time
- 📝 **Complete History** - Searchable table of all workout sessions
- 🌙 **Dark Mode** - Beautiful dark interface optimized for fitness tracking
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Hosting**: Vercel

## Data Flow

```
Apple Watch App → Saves workout → Supabase Database
                                          ↓
                                   Dashboard reads data
                                          ↓
                                   Displays charts & stats
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account with database set up
- Apple Watch Workout Companion app syncing data

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment variables are already set up in `.env.local`

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Quick Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. **⚠️ IMPORTANT:** Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
   - These must be set in: Project Settings → Environment Variables
6. Click "Deploy"

Your dashboard will be live at `https://your-project.vercel.app` in under a minute!

**Note:** The `.env.local` file is gitignored and won't be deployed. You MUST add the environment variables through the Vercel dashboard for the production site to work.

### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Database Schema

The dashboard connects to these Supabase tables:

- `workouts` - Workout templates
- `exercises` - Individual exercises with weight/sets/reps
- `exercise_history` - Historical records of each workout session
- `workout_sessions` - Session metadata with timestamps

## Pages

- **Dashboard** (`/`) - Overview stats and recent workouts
- **Progress** (`/progress`) - Weight progression charts for each exercise
- **History** (`/history`) - Complete workout log with search and filters

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous API key |

## License

MIT
