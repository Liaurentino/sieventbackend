import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reported: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Report', reportSchema);