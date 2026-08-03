# Data Storage & Tracking System Guide

## Overview

Your Multi-Agent Marketing service now has a complete **customer tracking system** with data storage, reference ID generation, and order management.

---

## How It Works

### Step 1: Customer Submits Request

**On:** Landing Page (`/landing/index.html`)

Customer fills out form:
- Company Name
- Contact (phone/email)
- Product
- Goal
- Brand Tone
- Description

**What happens:**
1. Form data is sent to backend via API
2. Backend generates **unique Reference ID**
3. Data is saved to `campaigns-database.json`
4. Customer receives Reference ID
5. WhatsApp notification sent to you

```
Reference ID format: REF-1725270123456-ABCDE
└─ Timestamp + Random String = Unique Identifier
```

---

## Step 2: Data Storage

### Location

```
backend/campaigns-database.json
```

### File Structure

```json
{
  "campaigns": [
    {
      "referenceId": "REF-1725270123456-ABCDE",
      "company": "Ahmad Sweets",
      "contact": "+923351600866",
      "product": "Special Barfi",
      "goal": "200 packets per day",
      "tone": "warm, traditional",
      "description": "15 years in business...",
      "status": "pending",
      "createdAt": "2026-08-03T10:30:00.000Z",
      "updatedAt": "2026-08-03T10:30:00.000Z",
      "campaign": null
    }
  ]
}
```

### Status Values

| Status | Meaning | What to do |
|--------|---------|-----------|
| `pending` | Just received | Read request, start generating |
| `processing` | Generating | Agents working on campaign |
| `completed` | Ready to send | Review and prepare to send |
| `delivered` | Sent to customer | Customer has their campaign |

---

## Step 3: Generate Campaign

**You do this:**

1. See request in database
2. Run the campaign through agents
3. Get final 8/10+ approved campaign
4. Update status to "processing" then "completed"

**Via backend:**

```bash
PUT http://localhost:3001/api/admin/campaigns/REF-1725270123456-ABCDE
Content-Type: application/json

{
  "status": "completed",
  "campaign": {
    "objective": "Drive daily sales...",
    "main_message": "...",
    "pillars": [...],
    "social_posts": [...],
    "whatsapp_message": "...",
    "call_to_action": "..."
  }
}
```

---

## Step 4: Customer Tracks Order

**On:** Tracking Page (`/landing/track.html`)

Customer enters Reference ID → sees:
- Order status (pending/processing/completed/delivered)
- Company & product details
- Timeline of progress
- Campaign preview (when ready)

---

## Data Retrieval Methods

### Method 1: Check Local File

View all campaigns:

```bash
# On your computer:
cat backend/campaigns-database.json
```

You'll see all customer requests and their status.

### Method 2: Use Backend API

**Get all campaigns:**

```bash
curl http://localhost:3001/api/admin/campaigns
```

**Get specific campaign:**

```bash
curl http://localhost:3001/api/admin/campaigns/REF-1725270123456-ABCDE
```

**Update campaign status:**

```bash
curl -X PUT http://localhost:3001/api/admin/campaigns/REF-1725270123456-ABCDE \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "campaign": { ... }
  }'
```

### Method 3: Export to Excel

Copy contents of `campaigns-database.json` to Excel/Google Sheets for better tracking.

---

## API Endpoints

### Save Campaign Request
```
POST /api/campaign-request
Content-Type: application/json

{
  "company": "...",
  "contact": "...",
  "product": "...",
  "goal": "...",
  "tone": "...",
  "description": "..."
}

Response:
{
  "status": "success",
  "referenceId": "REF-1725270123456-ABCDE",
  "message": "Campaign request received!",
  "nextSteps": "Use Reference ID to track your order"
}
```

### Retrieve Campaign
```
GET /api/campaign-request/:referenceId

Response:
{
  "status": "success",
  "campaign": {
    "referenceId": "REF-...",
    "company": "...",
    "status": "pending",
    ...
  }
}
```

### Update Campaign (Admin)
```
PUT /api/admin/campaigns/:referenceId
Content-Type: application/json

{
  "status": "completed",
  "campaign": { ... }
}

Response:
{
  "status": "success",
  "message": "Campaign updated",
  "campaign": { ... }
}
```

### View All Campaigns (Admin)
```
GET /api/admin/campaigns

Response:
{
  "status": "success",
  "total": 5,
  "campaigns": [ ... ]
}
```

---

## Workflow: From Request to Delivery

```
Customer submits form on landing page
            ↓
Backend saves to campaigns-database.json
            ↓
Reference ID generated & sent to customer
            ↓
WhatsApp notification to you (+923351600866)
            ↓
You read the request
            ↓
You run through agent pipeline
            ↓
Campaign generated & scored 8/10+
            ↓
You update status to "completed" + attach campaign
            ↓
Customer checks tracking page → sees campaign
            ↓
You send campaign via WhatsApp
            ↓
Update status to "delivered"
            ↓
Done! ✅
```

---

## Current Data Storage (Local)

### Pros ✅
- **Free** — No database costs
- **Simple** — Just a JSON file
- **Portable** — Easy to backup
- **No dependencies** — Doesn't require special tools

### Cons ❌
- **Not scalable** — 1000+ campaigns will get slow
- **No built-in backups** — Must backup manually
- **Single server only** — If you add more servers, data won't sync

---

## Future: Upgrade to Real Database

When you have 100+ customers, upgrade to:

### Option 1: Firebase (Recommended)
```
Pros:
- Free tier (generous)
- Real-time sync
- Built-in backups
- Scalable
- Easy to use

Cost: Free → $25+/month
Setup: 5 minutes
```

### Option 2: MongoDB Atlas
```
Pros:
- Free tier (512 MB)
- Document-based (JSON)
- Scalable
- Industry standard

Cost: Free → $9+/month
Setup: 10 minutes
```

### Option 3: Supabase (PostgreSQL)
```
Pros:
- Free tier (500 MB)
- Structured data
- SQL queries
- Real-time

Cost: Free → $25+/month
Setup: 15 minutes
```

**For now:** JSON file is perfect while you're testing and getting customers.

---

## Backup Your Data

**Important:** Back up your `campaigns-database.json` regularly!

### Daily Backup

```bash
# Copy to backup folder
cp backend/campaigns-database.json backend/backup/campaigns-$(date +%Y-%m-%d).json

# Or use GitHub (auto-backup)
git add backend/campaigns-database.json
git commit -m "Backup: Campaign database"
git push origin main
```

### Auto-Backup Script (Windows)

Create `backup.bat`:

```batch
@echo off
REM Daily backup script
set BACKUP_DIR=C:\Users\hp\Documents\Multi_Agent_Team\backend\backup
mkdir %BACKUP_DIR% 2>nul

REM Create backup with date
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
copy C:\Users\hp\Documents\Multi_Agent_Team\backend\campaigns-database.json %BACKUP_DIR%\campaigns-%mydate%.json

echo Backup created: %mydate%
```

Run daily via Windows Task Scheduler.

---

## Tracking Workflow for Customers

### Customer Journey

1. **Submit Request**
   - Fill form on landing page
   - Get Reference ID
   - Receive WhatsApp notification

2. **Track Status**
   - Go to `/landing/track.html`
   - Enter Reference ID
   - See status: pending → processing → completed → delivered
   - See timeline and campaign preview

3. **Get Campaign**
   - Receive campaign via WhatsApp (you send)
   - Or receive email link
   - Download and use

4. **Need Help?**
   - Click "Contact Support" on tracking page
   - Direct WhatsApp to you
   - Discuss revisions, questions, payment

---

## Example Workflow: Ahmad Sweets

```
Aug 3, 10:30 AM
Customer submits: Ahmad Sweets, Special Barfi, 200/day goal
→ Reference ID: REF-1725270123456-AHMED
→ Data saved to campaigns-database.json
→ WhatsApp notification to you

Aug 3, 10:35 AM
You get notification
→ Open campaign generator
→ Run Research → Strategy → Content → Review agents
→ Get 8/10 approved campaign

Aug 3, 10:40 AM
Campaign ready
→ Update status to "completed"
→ Attach campaign to database entry
→ Customer can see preview on tracking page

Aug 3, 11:00 AM
You send final campaign to customer via WhatsApp
→ Update status to "delivered"
→ Customer gets everything needed to launch

Done! ✅ Payment collected: Rs. 5,000
```

---

## Dashboard/Admin View

**You can create a simple admin dashboard to:**
- See all pending requests
- Update campaign status
- View all campaigns
- Export data to Excel

For now, you can:
1. Check `campaigns-database.json` manually
2. Use curl commands to update
3. Or build a simple dashboard later

---

## Security Notes

### Current (Local)
- Data stored in plain JSON file
- No password protection
- Anyone with access to your computer can view

### When Upgrading to Firebase/MongoDB
- Add password protection
- Encrypt sensitive data
- Add user authentication
- Create admin-only dashboard

---

## Support & Help

### What if customer can't find their Reference ID?

1. Check their email (confirmation)
2. Check your WhatsApp (incoming notification)
3. Check `campaigns-database.json` for their company name
4. Give them the Reference ID manually

### What if customer wants to change request?

Before you start generating:
- Update status back to "pending"
- Edit their data in JSON
- Re-generate campaign

After you start generating:
- Generate both versions
- Let them choose
- Use the one they prefer

---

## Summary

✅ **Customers submit** → Get Reference ID
✅ **Data saved** → campaigns-database.json
✅ **You generate** → Update status
✅ **Customers track** → See progress
✅ **You deliver** → Mark complete

Everything is connected and automated! 🚀
