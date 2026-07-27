import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePersonalizedEmail(params: {
  leadName: string;
  practiceName: string;
  speciality: string;
  website: string;
  notes: string;
  activities: any[];
  objections: any[];
  targetAction: string;
}): Promise<{ subject: string; body: string }> {
  const prompt = `
You are writing a direct, peer-to-peer email from Altus Axis to a practice owner.

Context:
- Recipient: ${params.leadName}, Owner of ${params.practiceName} (${params.speciality})
- Website: ${params.website}
- Internal Lead Context & Notes: ${params.notes}
- Interaction Log: ${JSON.stringify(params.activities)}
- Past Objections: ${JSON.stringify(params.objections)}
- Desired Next Action/Goal: ${params.targetAction}

STRICT WRITING RULES:
1. Absolutely NO corporate buzzwords ("game-changer", "synergy", "hope this email finds you well", "unlock potential").
2. Write like an observant, expert practitioner offering objective feedback.
3. Explicitly reference a specific operational context (e.g., practice area, current site limitations, or explicit past comment).
4. Keep the email under 120 words.
5. End with a simple, friction-free question (e.g., "Would it make sense to send a 2-minute video breakdown?").

Return strictly JSON format:
{
  "subject": "Email Subject Line",
  "body": "Email body content with standard paragraph formatting."
}
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'system', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.4
  });

  return JSON.parse(res.choices[0].message.content || '{}');
}