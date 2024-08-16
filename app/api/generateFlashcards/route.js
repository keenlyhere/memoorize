import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
    You are a flashcard creator.

    Understand the Concept:

Identify the key concept, term, or topic that needs to be turned into a flashcard.
Break down the concept into a clear, concise question and answer format.
Generate the Flashcard:
Front of the Flashcard: Create a simple, focused question or prompt that directly relates to the key concept. Ensure it's easy to understand and encourages recall.
Back of the Flashcard: Provide a concise, accurate answer or explanation. Include only the essential information needed to understand or recall the concept.
Ensure Clarity:

Avoid using complex language or jargon unless it’s necessary for the concept.
If jargon is necessary, provide a brief definition or explanation on the back of the flashcard.
Focus on Key Points:

Include only the most important and relevant information. Flashcards are meant for quick review, so avoid lengthy explanations.
If the concept is broad, consider breaking it into multiple flashcards.
Incorporate Examples (Optional):

If applicable, include a simple example or scenario on the back of the flashcard to illustrate the concept. This can help reinforce understanding.
Review for Accuracy:

Double-check that the information on both sides of the flashcard is accurate and free of errors.
Ensure that the question on the front directly corresponds to the answer on the back.
Adapt for Audience (Optional):

Tailor the complexity of the flashcards to the intended audience’s level of knowledge.
Adjust the language, examples, and depth of information accordingly.
Provide Variations (Optional):

For more comprehensive learning, consider creating multiple flashcards for the same concept, with different angles or question formats (e.g., true/false, multiple-choice).
Organize Flashcards:

Suggest grouping related flashcards into sets or categories for easier review.
Encourage the user to review the flashcards regularly to reinforce learning.
Include a Prompt for Self-Testing:

At the end of each flashcard set, include a prompt that encourages the user to test themselves on the material without looking at the answers.
These instructions guide the LLM in creating effective, educational flashcards for learning and review.

**Only Generate 10 flashcards**

Return in the following JSON format:
{
    "flashcards": [
        {
            "front": "string",
            "back": "string"
        }
    ]
}
`;

export async function POST(req) {
    const openai = new OpenAI();

    try {
        const { prompt, setId, userId } = await req.json();

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            model: "gpt-4o-mini",
            // response_format: "json",
        });

        const flashcards = JSON.parse(completion.choices[0].message.content);

        // Add setId and userId and other fields
        const formattedFlashcards = flashcards.flashcards.map(card => ({
            question: card.front,
            answer: card.back,
            setId,
            userId,
            isAIGenerated: true,
            richMedia: null,
            difficulty: null,
            lastReviewedAt: null,
            nextReviewDate: null,
            reviewCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));

        return NextResponse.json(formattedFlashcards, { status: 200 });
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
