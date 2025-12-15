import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Thought from '@/models/Thought';
import { getDataFromToken } from '@/lib/auth';

export async function GET(req) {
    try {
        await dbConnect();
        const userId = getDataFromToken(req);

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const thoughts = await Thought.find({ userId }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: thoughts });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const userId = getDataFromToken(req);

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { originalThought, reframedThought, emotion, cognitiveDistortion } = await req.json();

        const newThought = await Thought.create({
            userId,
            originalThought,
            reframedThought,
            emotion,
            cognitiveDistortion
        });

        return NextResponse.json({ success: true, data: newThought });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
