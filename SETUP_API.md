# Claude API Setup Instructions

## ⚠️ IMPORTANT: Secure Your API Key

**First:** Go to your Anthropic console and **revoke the API key you shared earlier** for security.

## 🔑 Setting Up Your New API Key

1. **Generate a new API key** at [console.anthropic.com](https://console.anthropic.com)

2. **Add it to your environment file:**
   - Open `/Users/dereklomas/CodeVibing/mathgames/.env.local`
   - Replace `your_new_api_key_here` with your actual API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   ```

3. **Restart the development server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

## ✅ Testing the Integration

1. **Visit** http://localhost:3000
2. **Go to the Prompt Mastery Agent**
3. **Select any exercise**
4. **Write a prompt and click "Analyze My Prompt"**
5. **You should see "Analyzing with Claude..." with a spinner**
6. **Claude will provide real feedback on your prompt!**

## 🔒 Security Features

- ✅ API key stored in `.env.local` (never committed to git)
- ✅ Server-side API calls (key never exposed to browser)
- ✅ Error handling if API is unavailable
- ✅ Graceful fallback to educational feedback

## 🎯 What You'll Experience

**Real Claude Integration:**
- Actual Claude analysis of your prompts
- Dynamic feedback based on your specific input
- Authentic conversational AI responses
- Real-time learning with production AI

**All 4 Agents Ready for Real API:**
- 💬 **Prompt Master** - Real prompt analysis
- 🎯 **Goal Coach** - Authentic goal breakdown
- 🎨 **Creative Collaborator** - True creative partnerships
- ⚡ **Productivity** - Real workflow optimization

## 🚨 If Something Goes Wrong

**API Key Issues:**
- Check `.env.local` has the correct key
- Verify the key is active in Anthropic console
- Restart the development server

**Error Messages:**
- "API key not configured" → Add key to `.env.local`
- "API unavailable" → Check your internet/Anthropic status
- Fallback responses → Normal if API temporarily unavailable

Your AI Literacy Lab now uses **real Claude conversations** for authentic learning! 🚀