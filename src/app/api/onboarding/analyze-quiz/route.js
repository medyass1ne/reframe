import { NextResponse } from 'next/server';
import { requestLlama } from '@/lib/ai';
import dbConnect from '@/lib/db';
import Patient from '@/models/Patient';
import Doctor from '@/models/Doctor';

export async function POST(req) {
    try {
        const { userId, problemDescription, quizAnswers } = await req.json();

        console.log('Analyze quiz request:', { userId, problemDescription, quizAnswersCount: quizAnswers?.length });

        if (!userId || !problemDescription || !quizAnswers) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 });
        }

        await dbConnect();

        const quizContext = quizAnswers.map((qa, i) =>
            `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`
        ).join('\n\n');

        const prompt = `You are a compassionate psychologist analyzing a patient's assessment.

Initial Concern: "${problemDescription}"

Quiz Responses:
${quizContext}

Provide a comprehensive analysis. Return ONLY valid JSON (no markdown):
{
  "moodAssessment": "One-word mood (e.g., Anxious, Depressed, Stressed, Overwhelmed, Uncertain)",
  "personalityTraits": ["Trait 1", "Trait 2", "Trait 3", "Trait 4"],
  "concerns": "2-3 sentence summary of their main concerns and emotional state",
  "recommendedSpecialty": "The type of therapist they need (e.g., Anxiety Specialist, Trauma Therapist, Clinical Psychologist, Depression Specialist)"
}

Be empathetic, specific, and professional.`;

        let analysis;

        try {
            const aiResponse = await requestLlama(prompt);
            console.log('AI Response received:', aiResponse.content.substring(0, 200));

            let cleanContent = aiResponse.content.trim();
            cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');

            const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanContent = jsonMatch[0];
            }

            console.log('Cleaned content:', cleanContent);
            analysis = JSON.parse(cleanContent);
        } catch (aiError) {
            console.error('AI parsing error:', aiError);

            analysis = {
                moodAssessment: "Uncertain",
                personalityTraits: ["Seeking Support", "Self-Aware", "Motivated", "Resilient"],
                concerns: "You're taking important steps to understand and address your mental health. Your willingness to seek help shows strength and self-awareness.",
                recommendedSpecialty: "Clinical Psychologist"
            };
        }

        const doctors = await Doctor.find({ available: true });
        let recommendedDoctor = null;

        if (doctors.length > 0) {
            recommendedDoctor = doctors.find(d =>
                d.specialty && d.specialty.toLowerCase().includes(analysis.recommendedSpecialty.toLowerCase().split(' ')[0])
            );

            if (!recommendedDoctor) {
                recommendedDoctor = doctors[0];
            }
        }

        await Patient.findOneAndUpdate(
            { userId },
            {
                userId,
                problemDescription,
                quizQuestions: quizAnswers,
                moodAssessment: analysis.moodAssessment,
                personalityTraits: analysis.personalityTraits,
                concerns: analysis.concerns,
                recommendedDoctorId: recommendedDoctor?._id,
                recommendedDoctorName: recommendedDoctor?.name,
                recommendedDoctorSpecialty: recommendedDoctor?.specialty,
                onboardingCompleted: true
            },
            { upsert: true, new: true }
        );

        console.log('Analysis saved successfully');

        return NextResponse.json({
            success: true,
            analysis: {
                moodAssessment: analysis.moodAssessment,
                personalityTraits: analysis.personalityTraits,
                concerns: analysis.concerns,
                recommendedDoctor: recommendedDoctor ? {
                    name: recommendedDoctor.name,
                    specialty: recommendedDoctor.specialty,
                    id: recommendedDoctor._id
                } : null
            }
        });

    } catch (error) {
        console.error('Quiz analysis error:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json({
            success: false,
            error: 'Failed to analyze quiz responses',
            details: error.message
        }, { status: 500 });
    }
}
