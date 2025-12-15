import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/models/Doctor';
import User from '@/models/User';

export async function GET(req) {
    try {
        await dbConnect();


        const userDoctors = await User.find({ role: 'doctor', available: true }).select('name specialization rate bio _id');


        const listedDoctors = await Doctor.find({ available: true });


        const doctors = [
            ...userDoctors.map(user => ({
                _id: user._id,
                name: user.name,
                specialty: user.specialization || 'General Therapist',
                rate: user.rate || 100,
                rating: 5,
                imageUrl: null,
                source: 'user'
            })),/* 
            ...listedDoctors.map(doc => ({
                _id: doc._id,
                name: doc.name,
                specialty: doc.specialty,
                rate: parseInt(doc.price) || 0,
                rating: doc.rating,
                imageUrl: doc.imageUrl,
                source: 'directory'
            })) */
        ];

        return NextResponse.json({ success: true, data: doctors });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
