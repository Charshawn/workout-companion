# Fix Vercel Deployment - Add Environment Variables

## The Problem
Your Vercel deployment at `workout-companion-pace.vercel.app` shows 0 workouts because it's missing the Supabase environment variables.

## The Solution
Add these environment variables to your Vercel project:

### Step-by-Step Instructions

1. **Go to your Vercel dashboard:**
   https://vercel.com/charshawn/workout-companion/settings/environment-variables

2. **Add these TWO environment variables:**

   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://jmvktdoqkwspusomyzwt.supabase.co`
   - Environment: Check all three boxes (Production, Preview, Development)

   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptdmt0ZG9xa3dzcHVzb215end0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNjQ4OTgsImV4cCI6MjEwNDg0MDg5OH0.0H_QRU7mlspWgG1BnSXCZPFLSROlkZyHHaaZ0cmEhC0`
   - Environment: Check all three boxes (Production, Preview, Development)

3. **Save the variables**

4. **Redeploy your site:**
   - Go to: https://vercel.com/charshawn/workout-companion/deployments
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"
   - Wait for the deployment to complete (usually 30-60 seconds)

5. **Test it:**
   - Go to: https://workout-companion-pace.vercel.app
   - Login with PIN: `1715`
   - You should now see all your workout data!

## Why This Happened
Your local `.env.local` file has these variables, but Vercel deployments need them set separately in the Vercel dashboard. The `.env.local` file is not pushed to Git (it's in `.gitignore`).

## Quick Links
- Vercel Project Settings: https://vercel.com/charshawn/workout-companion/settings
- Environment Variables: https://vercel.com/charshawn/workout-companion/settings/environment-variables
- Deployments: https://vercel.com/charshawn/workout-companion/deployments
