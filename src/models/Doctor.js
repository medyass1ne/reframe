import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    specialty: {
        type: String,
        required: true,
    },
    bio: String,
    about: String,
    location: String,
    rating: {
        type: Number,
        default: 0,
    },
    reviewsCount: {
        type: Number,
        default: 0,
    },
    price: String,
    available: {
        type: Boolean,
        default: true,
    },
    tags: [String],
    imageUrl: String,
    articleName: String,
    article: String,
    articleDate: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
