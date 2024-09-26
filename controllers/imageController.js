const Question = require('../models/question');

// Upload image to MongoDB
exports.uploadImage = async (req, res) => {
    try {
        const { name } = req.body; // The name of the person uploading the image
        const image = req.file.buffer; // The image file is in memory

        const newQuestion = new Question({ name, image, responses: [] });
        await newQuestion.save();
        res.status(200).json({ message: 'Image uploaded successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
};

// Fetch images based on the user name
exports.getImages = async (req, res) => {
    const { name } = req.query;
    try {
        const questions = await Question.find({ name });
        const imageResponses = questions.map(q => ({
            id: q._id,
            image: q.image.toString('base64'), // Convert binary to base64 for display
            responses: q.responses,
        }));
        res.status(200).json(imageResponses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch images' });
    }
};

// Send a response to a specific image
exports.sendResponse = async (req, res) => {
    const questionId = req.params.id;
    const { response } = req.body;

    try {
        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ message: 'Image not found' });

        question.responses.push(response);
        await question.save();
        res.status(200).json({ message: 'Response sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send response' });
    }
};
