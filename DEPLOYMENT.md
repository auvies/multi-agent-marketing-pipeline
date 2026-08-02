# Deployment Guide — Multi-Agent Marketing Pipeline

Complete guide to deploy this project to **Vercel** (Frontend) and **Render** (Backend).

---

## 📋 Prerequisites

- GitHub account (you have this ✅)
- Vercel account (free) — https://vercel.com
- Render account (free) — https://render.com
- Claude API key — https://console.anthropic.com

---

## Part 1: Deploy Backend to Render

### Step 1a: Go to Render
```
https://render.com
```

### Step 1b: Sign in with GitHub
- Click "Sign up with GitHub"
- Authorize Render to access your repos

### Step 1c: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Select your repo: `multi-agent-marketing-pipeline`
3. Connect

### Step 1d: Configure Backend
- **Name:** `campaign-backend` (or any name)
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free (or paid if needed)

### Step 1e: Add Environment Variables
1. Go to **"Environment"** section
2. Add variable:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** Paste your Claude API key from https://console.anthropic.com
3. Click "Save"

### Step 1f: Deploy
1. Click **"Create Web Service"**
2. Render will build and deploy automatically
3. Wait 3-5 minutes for deployment

**Your Backend URL will be:**
```
https://campaign-backend.onrender.com
```

✅ **Backend deployed!**

---

## Part 2: Deploy Frontend to Vercel

### Step 2a: Go to Vercel
```
https://vercel.com
```

### Step 2b: Sign in with GitHub
- Click "Sign up with GitHub" (or Sign in)
- Authorize Vercel to access your repos

### Step 2c: Import Project
1. Click **"Import Project"** or **"Add New"** → **"Project"**
2. Select your repo: `multi-agent-marketing-pipeline`
3. Click **"Import"**

### Step 2d: Configure Frontend
- **Framework:** Select **"Other"** (static HTML)
- **Root Directory:** `./frontend`
- **Build Command:** Leave empty (or `echo 'No build needed'`)
- **Output Directory:** `./`

### Step 2e: Add Environment Variables
1. Go to **"Environment Variables"** section
2. Add:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://campaign-backend.onrender.com` (your backend URL from Part 1)
3. Click "Save"

### Step 2f: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment

**Your Frontend URL will be:**
```
https://campaign-frontend.vercel.app
```

✅ **Frontend deployed!**

---

## Part 3: Connect Frontend to Backend

### Step 3a: Update Environment Variable
After you have both URLs:

1. Go back to **Vercel Dashboard**
2. Select your project: `campaign-frontend`
3. Go to **"Settings"** → **"Environment Variables"**
4. Edit `REACT_APP_API_URL`
5. Change value to your **Render backend URL**: `https://campaign-backend.onrender.com`
6. Save and redeploy

### Step 3b: Redeploy Frontend
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for it to complete

✅ **Frontend now connected to Backend!**

---

## Part 4: Test Your Live App

1. Go to your Vercel URL: `https://campaign-frontend.vercel.app`
2. Fill out the form:
   - Business Name: `Ahmad Sweets`
   - Product: `Special Barfi`
   - Goal: `200 packets per day`
   - Tone: `warm, traditional`
3. Click **"Generate Campaign"**
4. Wait 30-60 seconds for Claude to generate
5. See your campaign appear!

✅ **Live app working!**

---

## Part 5: Share with Customer

Send them this link:
```
https://campaign-frontend.vercel.app
```

They can:
- Fill out the form
- Generate campaigns in real-time
- Download results

---

## Troubleshooting

### Backend not responding?
1. Go to Render Dashboard
2. Select your service
3. Check "Logs" for errors
4. Verify `ANTHROPIC_API_KEY` is set

### Frontend not calling backend?
1. Check browser console (F12)
2. Verify `REACT_APP_API_URL` is correct
3. Redeploy frontend

### API tokens running out?
- Each campaign call uses Claude API tokens (costs money)
- Budget: ~$0.01-0.05 per campaign depending on length
- Monitor at https://console.anthropic.com/account/usage

---

## Local Testing (Before Deploying)

### Test Backend Locally
```bash
cd backend
npm install
ANTHROPIC_API_KEY=your_key npm start
```

Visit: `http://localhost:3001/api/health`

### Test Frontend Locally
```bash
# Option 1: Use Python
cd frontend
python -m http.server 3000

# Option 2: Use Node
cd frontend
npx http-server
```

Visit: `http://localhost:3000`

---

## Summary

| Component | Provider | URL | Status |
|-----------|----------|-----|--------|
| Frontend | Vercel | `https://campaign-frontend.vercel.app` | ✅ |
| Backend | Render | `https://campaign-backend.onrender.com` | ✅ |
| API Key | Anthropic | `console.anthropic.com` | ✅ |

---

## Next Steps

1. ✅ Deploy backend (Render)
2. ✅ Deploy frontend (Vercel)
3. ✅ Connect with environment variables
4. ✅ Test live app
5. ✅ Share with customer
6. Monitor costs at Claude console

**Enjoy your live campaign generator! 🚀**
