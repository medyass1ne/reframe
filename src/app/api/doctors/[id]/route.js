import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/models/Doctor';

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const doctor = await Doctor.findById(params.id);

        if (!doctor) {
            return NextResponse.json({
                success: false,
                error: 'Doctor not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch doctor'
        }, { status: 500 });
    }
}
