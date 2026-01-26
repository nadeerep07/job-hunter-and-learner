import Groq from 'groq-sdk';

export async function POST(request: Request) {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const { currentWeight, targetWeight, dailyIntake, age } = await request.json();

    if (!currentWeight || !targetWeight || !dailyIntake) {
      return Response.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const prompt = `I'm ${age || 23} years old, currently ${currentWeight}kg, my goal is ${targetWeight}kg.
My daily intake is around ${dailyIntake} calories.

Give me a quick 3-line suggestion for today (Indian-friendly diet focus preferred).
Be encouraging and practical. Focus on sustainable lifestyle changes.`;

    const message = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 150,
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

    return Response.json({ suggestion: content.trim() });
  } catch (error) {
    console.error('Groq API error:', error);
    return Response.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
}
