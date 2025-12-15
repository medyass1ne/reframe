import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    problemDescription: {
        type: String,
        required: true
    },
    quizQuestions: [{
        question: String,
        answer: String
    }],
    moodAssessment: {
        type: String,
        default: ''
    },
    personalityTraits: [{
        type: String
    }],
    concerns: {
        type: String,
        default: ''
    },
    recommendedDoctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    recommendedDoctorName: {
        type: String
    },
    recommendedDoctorSpecialty: {
        type: String
    },
    onboardingCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
