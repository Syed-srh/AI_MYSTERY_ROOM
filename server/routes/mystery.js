const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { format } = require('date-fns');
const Mystery = require('../models/Mystery');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Build the Gemini prompt
function buildPrompt(scenario) {
  return `You are an elite mystery game generator. Based on the user's scenario: "${scenario}", create a gripping murder/theft investigation.

You MUST return ONLY a valid JSON object — no markdown, no code fences, no explanations — with EXACTLY this structure:

{
  "storyline": "A vivid 2-3 sentence introduction to the case setting the scene.",
  "suspects": [
    { "id": "suspect_1", "name": "Full Name", "description": "Short physical/background description", "motive": "Clear motive for committing the crime" },
    { "id": "suspect_2", "name": "Full Name", "description": "Short physical/background description", "motive": "Clear motive for committing the crime" },
    { "id": "suspect_3", "name": "Full Name", "description": "Short physical/background description", "motive": "Clear motive for committing the crime" }
  ],
  "culprit": "suspect_2",
  "explanation": "A full explanation of how and why the culprit committed the crime, referencing the specific clues that prove their guilt.",
  "evidence": {
    "whatsappLogs": [
      { "sender": "Name", "receiver": "Name", "timestamp": "2024-01-15 21:34", "message": "Message text" },
      { "sender": "Name", "receiver": "Name", "timestamp": "2024-01-15 21:45", "message": "Message text" },
      { "sender": "Name", "receiver": "Name", "timestamp": "2024-01-15 22:10", "message": "Message text" },
      { "sender": "Name", "receiver": "Name", "timestamp": "2024-01-16 09:02", "message": "Message text" }
    ],
    "camRecordings": [
      { "timestamp": "2024-01-15 20:00", "description": "Vivid description of what the security camera captured, including who was seen and what they were doing." },
      { "timestamp": "2024-01-15 23:15", "description": "Vivid description of what the security camera captured." }
    ],
    "imageClues": [
      { "description": "Detailed visual description of a physical piece of evidence found at the scene (e.g., a torn fabric, a receipt, a fingerprint on glass)." },
      { "description": "Detailed visual description of another physical evidence item." }
    ]
  }
}

Rules:
- The culprit field must match exactly one of the suspect id values.
- Clues must logically point to the culprit without being too obvious — let the player figure it out.
- Make the story compelling, dramatic, and immersive.
- Use realistic names. Return ONLY the raw JSON object.`;
}

// POST /api/mystery/generate
router.post('/generate', async (req, res) => {
  const { scenario } = req.body;
  if (!scenario || scenario.trim().length < 5) {
    return res.status(400).json({ error: 'A valid scenario is required.' });
  }

  // Create a placeholder mystery with 'generating' status
  const mystery = new Mystery({ userScenario: scenario.trim() });
  await mystery.save();

  // Respond immediately with the ID so the frontend can start polling
  res.status(202).json({ mysteryId: mystery._id, status: 'generating' });

  // Generate in background with multi-model fallback
  (async () => {
    const CANDIDATE_MODELS = [
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
      'gemini-flash-lite-latest',
      'gemini-3.8-flash',
    ];

    let data = null;
    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        console.log(`[Mystery Gen] Attempting model: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' },
        });
        const result = await model.generateContent(buildPrompt(scenario));
        const rawText = result.response.text().trim();
        const jsonText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        data = JSON.parse(jsonText);
        console.log(`[Mystery Gen] Success with model: ${modelName}`);
        break;
      } catch (err) {
        console.warn(`[Mystery Gen] Model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    if (!data) {
      console.error('=== ALL GEMINI MODELS FAILED ===');
      console.error(lastError);
      mystery.status = 'failed';
      await mystery.save();
      return;
    }

    try {
      // Map imageClues → images
      const images = (data.evidence?.imageClues || []).map((clue) => ({
        url: '',
        description: clue.description,
      }));

      // Find culpritId from culprit name/id
      const culpritSuspect = (data.suspects || []).find(
        (s) => s.id === data.culprit || s.name === data.culprit
      );
      const culpritId = culpritSuspect ? culpritSuspect.id : (data.culprit || 'suspect_1');

      mystery.storyline = data.storyline || 'A mysterious crime has occurred.';
      mystery.suspects = data.suspects || [];
      mystery.culpritId = culpritId;
      mystery.explanation = data.explanation || '';
      mystery.evidence = {
        whatsappLogs: data.evidence?.whatsappLogs || [],
        images,
        camRecordings: data.evidence?.camRecordings || [],
      };
      mystery.status = 'ready';
      await mystery.save();
      console.log(`[Mystery Gen] Mystery ${mystery._id} is ready!`);
    } catch (err) {
      console.error('[Mystery Gen] Failed to process or save mystery:', err);
      mystery.status = 'failed';
      await mystery.save();
    }
  })();
});

// GET /api/mystery/:id  — returns mystery WITHOUT culpritId
router.get('/:id', async (req, res) => {
  try {
    const mystery = await Mystery.findById(req.params.id).select('-culpritId -explanation');
    if (!mystery) return res.status(404).json({ error: 'Mystery not found.' });
    res.json(mystery);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/mystery/:id/accuse
router.post('/:id/accuse', async (req, res) => {
  const { suspectId } = req.body;
  if (!suspectId) return res.status(400).json({ error: 'suspectId is required.' });

  try {
    const mystery = await Mystery.findById(req.params.id);
    if (!mystery) return res.status(404).json({ error: 'Mystery not found.' });
    if (mystery.status === 'generating') {
      return res.status(400).json({ error: 'Mystery is still being generated.' });
    }

    const success = suspectId === mystery.culpritId;
    const culprit = mystery.suspects.find((s) => s.id === mystery.culpritId);

    res.json({
      success,
      culpritName: culprit ? culprit.name : 'Unknown',
      explanation: mystery.explanation,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
