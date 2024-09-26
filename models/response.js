const mongoose = require('mongoose');
const responseSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    questionNumber: {
        type: String,
        required: true,
        unique:true
    },
    response: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound unique index on questionId and questionNumber
responseSchema.index({ questionId: 1, 
    questionNumber: 1 },
     { unique: true }
    );

const Response = mongoose.model('response', responseSchema);

module.exports = Response;
