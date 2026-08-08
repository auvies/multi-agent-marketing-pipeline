const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const NOTIFY_EMAIL = process.env.EMAIL_USER || 'auviesinam8@gmail.com';

async function sendCampaignRequestEmail(campaignRequest) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Multi-Agent Marketing <onboarding@resend.dev>',
        to: [NOTIFY_EMAIL],
        subject: `New Campaign Request: ${campaignRequest.company}`,
        text: [
          'New campaign request received!',
          '',
          `Reference ID: ${campaignRequest.referenceId}`,
          `Company: ${campaignRequest.company}`,
          `Contact: ${campaignRequest.contact}`,
          `Product: ${campaignRequest.product}`,
          `Goal: ${campaignRequest.goal}`,
          `Tone: ${campaignRequest.tone}`,
          `Description: ${campaignRequest.description || 'N/A'}`,
          '',
          `Submitted: ${campaignRequest.createdAt}`
        ].join('\n')
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error('Failed to send email notification:', response.status, errText);
    }
  } catch (error) {
    console.error('Failed to send email notification:', error.message);
  }
}

// Data storage file
const dataFile = path.join(__dirname, 'campaigns-database.json');
const configFile = path.join(__dirname, 'site-config.json');

const defaultSiteConfig = {
  theme: 'purple',
  heroTitle: 'Generate Professional Marketing Campaigns in Just 10 Minutes',
  heroSubtitle: 'Stop waiting weeks for copywriters. Our AI agent team handles research, strategy, content creation, and quality review — all automatically. Launch campaigns that convert.',
  contactPhone: '+92 335 1600866',
  contactEmail: 'auviesinam8@gmail.com',
  whatsappNumber: '923351600866'
};

const themes = {
  purple: { primary: '#667eea', secondary: '#764ba2' },
  blue: { primary: '#2193b0', secondary: '#6dd5ed' },
  green: { primary: '#11998e', secondary: '#38ef7d' },
  orange: { primary: '#f2994a', secondary: '#f2c94c' },
  pink: { primary: '#eb3349', secondary: '#f45c43' }
};

// Initialize database file if it doesn't exist
function initializeDatabase() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ campaigns: [] }, null, 2));
  }
  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, JSON.stringify(defaultSiteConfig, null, 2));
  }
}

function readSiteConfig() {
  try {
    const data = fs.readFileSync(configFile, 'utf8');
    return { ...defaultSiteConfig, ...JSON.parse(data) };
  } catch (error) {
    return defaultSiteConfig;
  }
}

function writeSiteConfig(data) {
  fs.writeFileSync(configFile, JSON.stringify(data, null, 2));
}

// Read campaigns from file
function readCampaigns() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { campaigns: [] };
  }
}

// Write campaigns to file
function writeCampaigns(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Middleware
app.use(cors());
app.use(express.json());

initializeDatabase();

// Root status page — human-readable dashboard instead of Express's default "Cannot GET /"
app.get('/', (req, res) => {
  const uptimeMinutes = Math.floor(process.uptime() / 60);
  const geminiConfigured = !!process.env.GEMINI_API_KEY;
  const emailConfigured = !!process.env.RESEND_API_KEY;
  const db = readCampaigns();

  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Campaign Backend — Status</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px; max-width: 700px; margin: 0 auto; }
  h1 { font-size: 24px; margin-bottom: 8px; }
  .sub { color: #94a3b8; margin-bottom: 30px; font-size: 14px; }
  .row { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: #1e293b; border-radius: 8px; margin-bottom: 10px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 10px; }
  .ok { background: #22c55e; }
  .off { background: #ef4444; }
  .label { font-weight: 600; }
  .value { color: #94a3b8; font-size: 13px; }
  code { background: #1e293b; padding: 3px 8px; border-radius: 4px; font-size: 13px; }
  .endpoints { margin-top: 30px; }
  .endpoints li { margin-bottom: 8px; font-size: 14px; }
</style>
</head>
<body>
  <h1>🚀 Multi-Agent Marketing — Backend</h1>
  <div class="sub">Live status and indicators</div>

  <div class="row"><span class="label"><span class="dot ok"></span>Server</span><span class="value">Running — uptime ${uptimeMinutes} min</span></div>
  <div class="row"><span class="label"><span class="dot ${geminiConfigured ? 'ok' : 'off'}"></span>Gemini AI (instant generation)</span><span class="value">${geminiConfigured ? 'Configured' : 'Not configured'}</span></div>
  <div class="row"><span class="label"><span class="dot ${emailConfigured ? 'ok' : 'off'}"></span>Email notifications</span><span class="value">${emailConfigured ? 'Configured' : 'Not configured'}</span></div>
  <div class="row"><span class="label"><span class="dot ok"></span>Campaign requests stored</span><span class="value">${db.campaigns.length}</span></div>

  <div class="endpoints">
    <strong>API Endpoints</strong>
    <ul>
      <li><code>GET /api/health</code> — health check</li>
      <li><code>POST /api/campaign-request</code> — save a request + email notification</li>
      <li><code>GET /api/campaign-request/:referenceId</code> — track a request</li>
      <li><code>POST /api/campaign</code> — instant AI generation (5-agent pipeline)</li>
      <li><code>GET /api/site-config</code> — public site theme/content</li>
      <li><code>GET /api/admin/campaigns</code> — admin: list requests</li>
    </ul>
  </div>
</body>
</html>`);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running! 🚀' });
});

// Save campaign request
app.post('/api/campaign-request', (req, res) => {
  try {
    const { company, contact, product, goal, tone, description, timestamp } = req.body;

    // Validate input
    if (!company || !contact || !product || !goal || !tone) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    // Generate reference ID
    const referenceId = 'REF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create campaign request record
    const campaignRequest = {
      referenceId: referenceId,
      company: company,
      contact: contact,
      product: product,
      goal: goal,
      tone: tone,
      description: description || '',
      status: 'pending', // pending, processing, completed, delivered
      createdAt: timestamp || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      campaign: null
    };

    // Save to database
    const db = readCampaigns();
    db.campaigns.push(campaignRequest);
    writeCampaigns(db);

    console.log(`✅ Campaign request saved: ${referenceId} for ${company}`);

    sendCampaignRequestEmail(campaignRequest);

    res.json({
      status: 'success',
      referenceId: referenceId,
      message: `Campaign request received! We'll generate your campaign within 24 hours.`,
      nextSteps: `Use Reference ID: ${referenceId} to track your order`
    });

  } catch (error) {
    console.error('Error saving campaign request:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to save campaign request'
    });
  }
});

// Retrieve campaign by reference ID
app.get('/api/campaign-request/:referenceId', (req, res) => {
  try {
    const { referenceId } = req.params;

    const db = readCampaigns();
    const campaign = db.campaigns.find(c => c.referenceId === referenceId);

    if (!campaign) {
      return res.status(404).json({
        error: 'Campaign request not found',
        referenceId: referenceId
      });
    }

    res.json({
      status: 'success',
      campaign: campaign
    });

  } catch (error) {
    console.error('Error retrieving campaign:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to retrieve campaign'
    });
  }
});

// Get all campaigns (admin endpoint)
app.get('/api/admin/campaigns', (req, res) => {
  try {
    const db = readCampaigns();
    res.json({
      status: 'success',
      total: db.campaigns.length,
      campaigns: db.campaigns
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update campaign status (admin endpoint)
app.put('/api/admin/campaigns/:referenceId', (req, res) => {
  try {
    const { referenceId } = req.params;
    const { status, campaign } = req.body;

    const db = readCampaigns();
    const index = db.campaigns.findIndex(c => c.referenceId === referenceId);

    if (index === -1) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    db.campaigns[index].status = status || db.campaigns[index].status;
    db.campaigns[index].campaign = campaign || db.campaigns[index].campaign;
    db.campaigns[index].updatedAt = new Date().toISOString();

    writeCampaigns(db);

    res.json({
      status: 'success',
      message: 'Campaign updated',
      campaign: db.campaigns[index]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get site configuration (public — landing page reads this on load)
app.get('/api/site-config', (req, res) => {
  try {
    const config = readSiteConfig();
    const colors = themes[config.theme] || themes.purple;
    res.json({ status: 'success', config: { ...config, colors } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update site configuration (admin endpoint)
app.put('/api/admin/site-config', (req, res) => {
  try {
    const current = readSiteConfig();
    const { theme, heroTitle, heroSubtitle, contactPhone, contactEmail, whatsappNumber } = req.body;

    if (theme && !themes[theme]) {
      return res.status(400).json({ error: `Unknown theme: ${theme}` });
    }

    const updated = {
      theme: theme || current.theme,
      heroTitle: heroTitle || current.heroTitle,
      heroSubtitle: heroSubtitle || current.heroSubtitle,
      contactPhone: contactPhone || current.contactPhone,
      contactEmail: contactEmail || current.contactEmail,
      whatsappNumber: whatsappNumber || current.whatsappNumber
    };

    writeSiteConfig(updated);

    res.json({ status: 'success', config: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List available themes (public)
app.get('/api/themes', (req, res) => {
  res.json({ status: 'success', themes });
});

// Main campaign generation endpoint
app.post('/api/campaign', async (req, res) => {
  try {
    const { businessName, product, goal, tone, description } = req.body;

    // Validate input
    if (!businessName || !product || !goal || !tone) {
      return res.status(400).json({
        error: 'Missing required fields: businessName, product, goal, tone'
      });
    }

    console.log('Generating campaign for:', businessName);

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    async function askAgent(prompt) {
      const result = await model.generateContent(prompt);
      return result.response.text();
    }

    function extractJson(text) {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: text };
      } catch (e) {
        return { raw: text };
      }
    }

    const brief = `Business Name: ${businessName}
Product/Service: ${product}
Sales Goal: ${goal}
Brand Tone: ${tone}
Additional Info: ${description || 'None provided'}`;

    // 1. Research Agent — audience insights only
    const researchText = await askAgent(`You are the Research Agent on a marketing team. Given this project brief, produce audience insights ONLY — who the target audience is, their needs, and what motivates them to buy. Do not write strategy or content. No fabricated stats.

${brief}

Respond as JSON: { "audience_insights": "..." }`);
    const research = extractJson(researchText);

    // 2. Strategy Agent — objective, main message, content pillars
    const strategyText = await askAgent(`You are the Strategy Agent. Using the brief and audience insights below, produce the campaign objective (one sentence), the main marketing message, and 2-3 content pillars. Do not write social copy.

Brief:
${brief}

Audience Insights:
${research.audience_insights || researchText}

Respond as JSON: { "objective": "...", "main_message": "...", "pillars": ["...", "..."] }`);
    const strategy = extractJson(strategyText);

    // 3. Content Agent — social posts, WhatsApp message, call to action
    const contentText = await askAgent(`You are the Content Agent. Using the brief and strategy below, write 3 social media posts, one WhatsApp broadcast message (160 words max), and one call to action (25 words max). Match the stated tone exactly. No repeated ideas across posts, no fabricated stats/reviews/quotes — use [TODO: ...] for anything requiring real data you don't have.

Brief:
${brief}

Strategy:
Objective: ${strategy.objective || ''}
Main Message: ${strategy.main_message || ''}
Pillars: ${(strategy.pillars || []).join('; ')}

Respond as JSON: { "social_posts": ["...", "...", "..."], "whatsapp_message": "...", "call_to_action": "..." }`);
    const content = extractJson(contentText);

    // 4. Review Agent — score out of 10, rewrite weak lines
    const reviewText = await askAgent(`You are the Review Agent. Score the content below out of 10 against the goal and tone. Rewrite any weak or off-tone lines directly and return the final, best version of every field along with the score and improvement notes.

Brief:
${brief}

Content:
${JSON.stringify(content)}

Respond as JSON: { "score": <number 1-10>, "improvement_notes": "...", "final_social_posts": ["...", "...", "..."], "final_whatsapp_message": "...", "final_call_to_action": "..." }`);
    const review = extractJson(reviewText);

    // 5. Orchestrator — assemble the final package
    const campaign = {
      audience_insights: research.audience_insights || research.raw || '',
      objective: strategy.objective || '',
      main_message: strategy.main_message || '',
      pillars: strategy.pillars || [],
      social_posts: review.final_social_posts || content.social_posts || [],
      whatsapp_message: review.final_whatsapp_message || content.whatsapp_message || '',
      call_to_action: review.final_call_to_action || content.call_to_action || '',
      review_score: review.score ?? null,
      improvement_notes: review.improvement_notes || ''
    };

    res.json({
      status: 'success',
      businessName: businessName,
      campaign: campaign,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to generate campaign',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📝 Campaign Generator: http://localhost:${PORT}/api/campaign`);
  console.log(`💾 Save Request: http://localhost:${PORT}/api/campaign-request`);
  console.log(`📊 Track Order: http://localhost:${PORT}/api/campaign-request/:referenceId`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📂 Data stored in: ${dataFile}`);
});
