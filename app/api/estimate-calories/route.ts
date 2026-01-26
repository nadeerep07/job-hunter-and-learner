import Groq from 'groq-sdk';

export async function POST(request: Request) {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const { mealItems } = await request.json();

    if (!mealItems || typeof mealItems !== 'string') {
      return Response.json(
        { error: 'Meal items are required' },
        { status: 400 }
      );
    }

    const prompt = `I ate: ${mealItems}

Estimate the total calories for this meal. 
Respond with ONLY a number (e.g., 450).
Keep estimates reasonable and healthy-focused.
If unsure, provide a reasonable average estimate.`;

    const message = await groq.chat.completions.create({
     model: 'llama-3.1-8b-instant',
      max_tokens: 50,
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

    const caloriesText = content.trim();
    const calories = parseInt(caloriesText, 10);

    if (isNaN(calories)) {
      throw new Error('Invalid calorie response');
    }

    return Response.json({ calories });
  } catch (error) {
    console.error('Groq API error:', error);
    return Response.json(
      { error: 'Failed to estimate calories' },
      { status: 500 }
    );
  }
}
