import { NextResponse } from 'next/server';
import { requestLlama } from '@/lib/ai';

export async function POST(req) {
    try {
        const { message } = await req.json();

        if (!message || message.trim().length < 3) {
            return NextResponse.json({
                success: false,
                error: 'Please provide a message'
            }, { status: 400 });
        }

        const prompt = `You are a helpful support assistant for Reframe, a mental wellness platform. Answer the user's question concisely and helpfully.

About Reframe:
- AI-powered thought reframing tool (helps transform negative thoughts into balanced perspectives)
- Decision Simulator (role-play scenarios to understand outcomes)
- Mood Tracker (log and monitor emotional well-being)
- Connect with licensed mental health professionals
- All data is private and secure
- Free to sign up, no credit card required

User question: "${message}"

Provide a helpful, concise answer (2-4 sentences). Be friendly and supportive. If they ask about features, explain briefly. If they ask how to do something, give clear steps.`;

        const aiResponse = await requestLlama(prompt);
        const answer = aiResponse.content.trim();

        return NextResponse.json({
            success: true,
            answer: answer
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        return NextResponse.json({
            success: false,
            error: 'Sorry, I had trouble processing that. Please try again or use the quick action buttons above.'
        }, { status: 500 });
    }
}
