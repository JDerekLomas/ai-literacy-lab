#!/bin/bash

echo "🚀 Setting up GitHub repository for AI Literacy Learning Lab"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run 'git init' first."
    exit 1
fi

echo "📝 Please enter your GitHub username:"
read -p "Username: " username

if [ -z "$username" ]; then
    echo "❌ Username cannot be empty"
    exit 1
fi

echo ""
echo "🔗 Setting up GitHub remote..."

# Add remote
git remote add origin "https://github.com/$username/ai-literacy-lab.git"

echo "✅ Remote added: https://github.com/$username/ai-literacy-lab.git"
echo ""
echo "📤 Ready to push to GitHub!"
echo ""
echo "⚠️  IMPORTANT: Create the repository on GitHub first:"
echo "   1. Go to https://github.com/new"
echo "   2. Repository name: ai-literacy-lab"
echo "   3. Make it Public"
echo "   4. Don't initialize with README"
echo "   5. Click 'Create repository'"
echo ""
echo "Then run these commands:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🎉 Your AI Literacy Learning Lab will be live on GitHub!"