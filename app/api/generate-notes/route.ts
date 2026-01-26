import Groq from 'groq-sdk';

export async function POST(request: Request) {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const { topic } = await request.json();

    if (!topic || typeof topic !== 'string') {
      return Response.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const prompt = `Generate beginner-friendly learning notes about ${topic}.

Response must follow this EXACT format with headers:

Definition
[clear 2-3 sentence paragraph]

Purpose / Why it matters
[1-2 sentence explanation]

Simple Example
[code snippet or practical example if applicable, otherwise explain with an example]

Notes
[2-3 bullet points for key takeaways]`;

    const message = await groq.chat.completions.create({
       model: 'llama-3.1-8b-instant',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.choices[0].message.content;
    if (!content || typeof content !== 'string') {
      throw new Error('Unexpected response type from Groq');
    }

    return Response.json({ notes: content });
  } catch (error) {
    console.error('Groq API error:', error);
    return Response.json(
      { error: 'Failed to generate notes' },
      { status: 500 }
    );
  }
}
