const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
const client = new Anthropic();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running! 🚀' });
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
  console.log(`📝 API available at http://localhost:${PORT}/api/campaign`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});
