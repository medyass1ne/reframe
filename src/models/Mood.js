import mongoose from 'mongoose';

const MoodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    note: {
        type: String,
        maxlength: 200,
    },
    scenarios: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Mood || mongoose.model('Mood', MoodSchema);
