import { NextResponse } from 'next/server';
import { requestLlama } from '@/lib/ai';

export async function POST(req) {
    try {
        const { thought } = await req.json();

        if (!thought || thought.trim().length < 10) {
            return NextResponse.json({
                success: false,
                error: 'Please provide a thought to reframe (at least 10 characters)'
            }, { status: 400 });
        }

        const prompt = `You are a compassionate cognitive behavioral therapy assistant. A user shared this negative thought: "${thought}"

Provide a BRIEF reframed perspective (2-3 sentences max) that:
1. Acknowledges their feelings
2. Offers a more balanced view
3. Is encouraging but realistic

Keep it concise and supportive. This is a demo, so don't include action steps.`;

        const aiResponse = await requestLlama(prompt);
        const reframed = aiResponse.content.trim();

        return NextResponse.json({
            success: true,
            reframed: reframed
        });

    } catch (error) {
        console.error('Demo reframe error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to process your thought. Please try again.'
        }, { status: 500 });
    }
}
