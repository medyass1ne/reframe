import mongoose from 'mongoose';

const ThoughtSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    originalThought: {
        type: String,
        required: true,
    },
    reframedThought: {
        type: String,
        required: true,
    },
    emotion: String,
    cognitiveDistortion: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Thought || mongoose.model('Thought', ThoughtSchema);
