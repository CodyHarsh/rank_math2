import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    summary: String,
    error_message: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Summary', summarySchema);