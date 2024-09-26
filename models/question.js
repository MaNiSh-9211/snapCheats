const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true,
        unique: true 
    },
    image: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    responses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Response'
    }]
});

const Question = mongoose.model('images', questionSchema);

module.exports = Question;
