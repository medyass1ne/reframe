import { NextResponse } from 'next/server';
import { requestLlama } from '@/lib/ai';

export async function POST(req) {
    try {
        const { problemDescription, userId } = await req.json();

        if (!problemDescription || !userId) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 });
        }

        const prompt = `You are a compassionate mental health professional creating a personalized assessment quiz.

The patient described their concern as: "${problemDescription}"

Generate 5 relevant, thoughtful questions to better understand their mental state, personality, and needs. Questions should be:
- Open-ended and empathetic
- Focused on their specific concern
- Designed to reveal mood, coping mechanisms, support systems, and triggers
- Professional but warm in tone

Return ONLY a JSON array of question strings (no markdown, no code blocks):
["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

        const aiResponse = await requestLlama(prompt);

        let cleanContent = aiResponse.content.trim();
        cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            cleanContent = jsonMatch[0];
        }

        const questions = JSON.parse(cleanContent);

        if (!Array.isArray(questions) || questions.length < 3) {
            throw new Error('Invalid questions format');
        }

        return NextResponse.json({
            success: true,
            questions: questions.slice(0, 5)
        });

    } catch (error) {
        console.error('Quiz generation error:', error);

        return NextResponse.json({
            success: true,
            questions: [
                "How would you describe your current emotional state?",
                "What situations or thoughts trigger these feelings most often?",
                "How do you typically cope when you're feeling this way?",
                "Do you have people you can talk to about how you're feeling?",
                "How has this been affecting your daily life (sleep, work, relationships)?"
            ]
        });
    }
}
