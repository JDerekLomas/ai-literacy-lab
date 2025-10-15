# Deployment Guide: AI Literacy Learning Lab

## 🚀 Deploy to GitHub & Netlify

### Step 1: Create GitHub Repository

1. **Go to GitHub.com** and sign in
2. **Click "New repository"** (+ icon in top right)
3. **Repository details:**
   - Name: `ai-literacy-lab`
   - Description: `AI Literacy Learning Lab - Master AI communication through hands-on practice`
   - Make it **Public**
   - **Don't** initialize with README (we already have one)
4. **Click "Create repository"**

### Step 2: Push Code to GitHub

Copy and run these commands in your terminal (in the mathgames directory):

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-literacy-lab.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)** and sign in with GitHub
2. **Click "New site from Git"**
3. **Connect to GitHub** and select your `ai-literacy-lab` repository
4. **Build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** `18.x` (in Environment variables)

### Step 4: Configure Environment Variables on Netlify

⚠️ **CRITICAL:** Your app needs the Claude API key to work!

1. **In your Netlify site dashboard:** Go to "Site settings" → "Environment variables"
2. **Add this variable:**
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** `[YOUR_CLAUDE_API_KEY_FROM_CONSOLE_ANTHROPIC_COM]`

3. **Click "Save"**
4. **Trigger a new deploy:** Go to "Deploys" → "Trigger deploy" → "Deploy site"

### Step 5: Configure for Next.js on Netlify

Add this file to your repository for proper Next.js deployment:

**File: `netlify.toml`** (in root directory):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

After adding this file:
```bash
git add netlify.toml
git commit -m "Add Netlify configuration for Next.js deployment"
git push origin main
```

## 🎯 Expected Results

**GitHub Repository:** `https://github.com/YOUR_USERNAME/ai-literacy-lab`
- ✅ Full source code (except .env.local - secure!)
- ✅ Professional README with setup instructions
- ✅ All 4 AI literacy agents
- ✅ Real Claude API integration

**Netlify Deployment:** `https://YOUR_SITE_NAME.netlify.app`
- ✅ Live AI Literacy Learning Lab
- ✅ Real Claude API working in production
- ✅ All 4 agents accessible
- ✅ Secure environment variables

## 🔧 Troubleshooting

**Build Fails:**
- Check Node version is 18.x in Netlify settings
- Verify environment variable is set correctly
- Check deploy logs for specific errors

**API Not Working:**
- Verify `ANTHROPIC_API_KEY` environment variable is set on Netlify
- Check the key is active in your Anthropic console
- Trigger a new deploy after adding environment variables

**404 Errors:**
- Make sure `netlify.toml` is committed and pushed
- Verify publish directory is `.next`
- Check that the Next.js plugin is working

## 🌟 What You'll Have

A **production AI literacy platform** where anyone can:
- Learn prompt engineering with real Claude feedback
- Transform goals into AI-assisted action plans
- Practice creative collaboration with AI
- Master productivity workflows

**Ready to make AI literacy accessible to everyone!** 🚀