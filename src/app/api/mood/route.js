import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Mood from '@/models/Mood';
import { getDataFromToken } from '@/lib/auth';

export async function GET(req) {
    try {
        await dbConnect();
        const userId = getDataFromToken(req);

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const moods = await Mood.find({ userId }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: moods });
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

        const { level, note, scenarios } = await req.json();

        const newMood = await Mood.create({
            userId,
            level,
            note,
            scenarios
        });

        return NextResponse.json({ success: true, data: newMood });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
