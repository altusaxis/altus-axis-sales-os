import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface LeadContext {
  firstName: string;
  practiceName: string;
  website?: string;
  notes?: string;
  speciality?: string;
  activities: Array<{ type: string; title: string; created_at: string }>;
  objections: Array<{ objection: string }>;
  lastContacted?: string;
}

export interface AIScoringResult {
  priorityScore: number;
  buyingIntent: number;
  budgetEstimate: number;
  urgency: number;
  websiteNeed: number;
  relationshipStrength: number;
  warmth: 'ice_cold' | 'aware' | 'friendly' | 'engaged' | 'interested' | 'warm' | 'hot' | 'customer' | 'advocate';
  observations: string;
  suggestedAction: string;
  suggestedActionReason: string;
  nextRecommendedContactDays: number;
}

export async function evaluateLeadWithAI(context: LeadContext): Promise<AIScoringResult> {
  const prompt = `
You are an expert AI Sales Operator for a high-end website design and conversion agency (Altus Axis).
Analyze the following lead context and determine exact strategy, warmth, scores, and next actions.

Lead Metadata:
- Name: ${context.firstName}
- Practice: ${context.practiceName}
- Website: ${context.website || 'None'}
- Speciality: ${context.speciality || 'General Practice'}
- Historical Notes: ${context.notes || 'None'}
- Recent Activities: ${JSON.stringify(context.activities)}
- Previous Objections: ${JSON.stringify(context.objections)}
- Last Contacted: ${context.lastContacted || 'Never'}

REASONING RULES:
1. "Wait" IS A VALID ACTION if contacted too recently or specified a future date (e.g., "busy until September").
2. High engagement (e.g., multiple email opens, downloaded playbook) spikes Buying Intent and Priority.
3. Poor website indicators or running Google Ads increases Website Need and Budget Estimate.

Return strictly JSON matching this structure:
{
  "priorityScore": number (0-100),
  "buyingIntent": number (0-100),
  "budgetEstimate": number (estimated numeric value in USD/GBP),
  "urgency": number (0-100),
  "websiteNeed": number (0-100),
  "relationshipStrength": number (0-100),
  "warmth": "ice_cold" | "aware" | "friendly" | "engaged" | "interested" | "warm" | "hot" | "customer" | "advocate",
  "observations": "Clear, concise observation bullets explaining system context.",
  "suggestedAction": "Exact tactical action (e.g., 'Send personalized Loom audit')",
  "suggestedActionReason": "Strategic justification for why this action now.",
  "nextRecommendedContactDays": number (days from today to schedule next touchpoint)
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'system', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  return result as AIScoringResult;
}