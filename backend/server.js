const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
const client = new Anthropic();

const emailTransporter = (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD)
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      },
      connectionTimeout: 10000
    })
  : null;

async function sendCampaignRequestEmail(campaignRequest) {
  if (!emailTransporter) return;
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
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
    });
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

    // Call Claude to generate campaign strategy
    const message = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are a marketing campaign expert. Create a complete social media campaign strategy for this business:

Business Name: ${businessName}
Product/Service: ${product}
Sales Goal: ${goal}
Brand Tone: ${tone}
Additional Info: ${description || 'None provided'}

Generate a JSON response with:
{
  "objective": "Campaign objective (one sentence)",
  "main_message": "Main marketing message",
  "pillars": [
    "Pillar 1 - Theme and what to emphasize",
    "Pillar 2 - Theme and what to emphasize",
    "Pillar 3 - Theme and what to emphasize"
  ],
  "social_posts": [
    "Post 1 for Instagram/Facebook",
    "Post 2 for Instagram/Facebook",
    "Post 3 for Instagram/Facebook"
  ],
  "whatsapp_message": "WhatsApp broadcast message (160 words max)",
  "call_to_action": "Single compelling CTA (25 words max)"
}

Make the content warm, authentic, and tailored to the business. No fabricated stats or fake testimonials. Focus on real benefits and genuine value.`
        }
      ]
    });

    // Parse the response
    const campaignText = message.content[0].text;

    // Try to extract JSON from response
    let campaign;
    try {
      const jsonMatch = campaignText.match(/\{[\s\S]*\}/);
      campaign = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: campaignText };
    } catch (e) {
      campaign = { raw: campaignText };
    }

    // Return success response
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
