// Claude AI API Integration
// To use this with real API calls, replace 'YOUR_CLAUDE_API_KEY_HERE' with your actual API key from Anthropic
// Get your API key at: https://console.anthropic.com/

const CLAUDE_API_KEY = 'YOUR_CLAUDE_API_KEY_HERE';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

interface ClaudeRequestParams {
  userName: string;
  senderName: string;
  receivedEmail: string;
  tone: string;
  additionalContext?: string;
}

export async function generateEmailResponse(params: ClaudeRequestParams): Promise<string> {
  const { userName, senderName, receivedEmail, tone, additionalContext } = params;

  try {
    // Call the backend API proxy
    const response = await fetch('http://localhost:3001/api/generate-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        senderName,
        receivedEmail,
        tone,
        additionalContext,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling API:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to generate response. Please ensure the backend server is running.'
    );
  }
}

function buildPrompt(
  userName: string,
  senderName: string,
  receivedEmail: string,
  tone: string,
  additionalContext?: string
): string {
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

function getMockResponse(params: ClaudeRequestParams): string {
  const { userName, senderName, receivedEmail, tone, additionalContext } = params;

  const greetings = {
    professional: `Dear ${senderName},`,
    friendly: `Hi ${senderName}!`,
    formal: `Dear ${senderName},`,
    casual: `Hey ${senderName}!`,
  };

  const closings = {
    professional: `Best regards,\n${userName}`,
    friendly: `Best,\n${userName}`,
    formal: `Yours sincerely,\n${userName}`,
    casual: `Cheers,\n${userName}`,
  };

  // Generate contextual response based on email content
  const emailLower = receivedEmail.toLowerCase();
  let contextualResponse = '';
  
  // Detect common email topics and generate appropriate responses
  if (emailLower.includes('meeting') || emailLower.includes('schedule')) {
    contextualResponse = tone === 'formal' 
      ? 'I am available to meet at your convenience. Please advise on a suitable time and date.'
      : tone === 'casual'
      ? "I'm free to meet up! Just let me know when works for you."
      : 'I would be happy to schedule a meeting. Please let me know your availability.';
  } else if (emailLower.includes('question') || emailLower.includes('help') || emailLower.includes('?')) {
    contextualResponse = tone === 'formal'
      ? 'I shall endeavor to provide comprehensive answers to your inquiries. Please find my responses below.'
      : tone === 'casual'
      ? "Happy to help! Here's what I think about your questions."
      : 'I would be glad to help answer your questions. Let me address each point.';
  } else if (emailLower.includes('thank') || emailLower.includes('appreciate')) {
    contextualResponse = tone === 'formal'
      ? 'Your kind words are most appreciated. It has been my pleasure to assist you.'
      : tone === 'casual'
      ? "No problem at all! Always happy to help out."
      : 'You are very welcome. I am pleased I could be of assistance.';
  } else if (emailLower.includes('project') || emailLower.includes('work')) {
    contextualResponse = tone === 'formal'
      ? 'I have reviewed the project details and am prepared to proceed accordingly.'
      : tone === 'casual'
      ? "I've checked out the project details and I'm ready to get started!"
      : 'I have reviewed the project information and am ready to move forward.';
  } else {
    // Generic response
    contextualResponse = tone === 'formal'
      ? 'I acknowledge receipt of your correspondence and have given due consideration to the matters raised therein.'
      : tone === 'casual'
      ? "Thanks for reaching out! I've looked over what you sent."
      : 'Thank you for your email. I have reviewed the information you provided.';
  }

  const greeting = greetings[tone as keyof typeof greetings] || greetings.professional;
  const closing = closings[tone as keyof typeof closings] || closings.professional;

  let response = `${greeting}\n\n${contextualResponse}\n\n`;
  
  if (additionalContext) {
    response += `${additionalContext}\n\n`;
  }
  
  // Add a contextual closing line
  const closingLine = tone === 'formal'
    ? 'Should you require any additional information, please do not hesitate to contact me.'
    : tone === 'casual'
    ? 'Let me know if you need anything else!'
    : 'Please feel free to reach out if you have any questions.';
  
  response += `${closingLine}\n\n${closing}`;

  return response;
}
