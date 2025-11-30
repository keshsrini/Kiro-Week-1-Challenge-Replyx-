import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Claude API proxy endpoint
app.post('/api/generate-response', async (req, res) => {
  try {
    const { userName, senderName, receivedEmail, tone, additionalContext } = req.body;

    // Validate required fields
    if (!userName || !senderName || !receivedEmail || !tone) {
      return res.status(400).json({ 
        error: 'Missing required fields: userName, senderName, receivedEmail, tone' 
      });
    }

    const apiKey = process.env.VITE_ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not configured on server' 
      });
    }

    // Build the prompt
    const prompt = buildPrompt(userName, senderName, receivedEmail, tone, additionalContext);

    // Try multiple model names in order of preference
    const modelNames = [
      'claude-sonnet-4-20250514',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-sonnet-20240620',
      'claude-3-sonnet-20240229',
      'claude-3-opus-20240229'
    ];

    let lastError = null;
    
    for (const modelName of modelNames) {
      try {
        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: modelName,
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.content[0].text;
          console.log(`✅ Successfully used model: ${modelName}`);
          return res.json({ response: generatedText });
        }

        const errorData = await response.json().catch(() => ({}));
        
        // If it's a model not found error, try the next model
        if (errorData.error?.type === 'not_found_error') {
          console.log(`⚠️  Model ${modelName} not available, trying next...`);
          lastError = errorData;
          continue;
        }

        // For other errors, return immediately
        console.error('Claude API error:', errorData);
        return res.status(response.status).json({ 
          error: errorData.error?.message || `API request failed with status ${response.status}` 
        });
      } catch (error) {
        lastError = error;
        console.error(`Error with model ${modelName}:`, error);
        continue;
      }
    }

    // If we get here, none of the models worked
    console.error('All models failed. Last error:', lastError);
    return res.status(500).json({ 
      error: 'Unable to find a compatible Claude model. Please check your API key and account access.' 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

function buildPrompt(userName, senderName, receivedEmail, tone, additionalContext) {
  let toneInstruction = '';
  
  switch (tone) {
    case 'professional':
      toneInstruction = 'professional, polished, and business-appropriate';
      break;
    case 'friendly':
      toneInstruction = 'warm, friendly, and approachable while remaining professional';
      break;
    case 'formal':
      toneInstruction = 'formal, respectful, and highly professional with traditional business language';
      break;
    case 'casual':
      toneInstruction = 'casual, relaxed, and conversational';
      break;
    default:
      toneInstruction = 'professional and appropriate';
  }

  return `You are an expert email response writer. Generate a ${toneInstruction} email response based on the following information:

MY NAME: ${userName}
SENDER'S NAME: ${senderName}

RECEIVED EMAIL:
${receivedEmail}

${additionalContext ? `ADDITIONAL CONTEXT:\n${additionalContext}\n` : ''}

Please write a complete, contextually appropriate email response that:
1. Addresses the sender by name (${senderName})
2. Responds to all key points in their email
3. Maintains a ${toneInstruction} tone throughout
4. Is signed by ${userName}
5. Is ready to send (complete with greeting and closing)
6. Is natural, helpful, and appropriate for the context

Generate ONLY the email response text, without any explanations or meta-commentary.`;
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email Response Generator API ready`);
});
