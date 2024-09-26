const express = require('express');
const router = express.Router();
const Question = require('../models/question'); // Adjust to your model
const Response = require('../models/response'); // Import the Response model


// router.get('/favicon.png', (req, res) => {
//     res.status(204).send();  // Send an empty response with no content
//   });
// Upload image route
router.post('/upload', async (req, res) => {
    console.log('Incoming request body:', req.body); // Log incoming request body
    console.log('Handling POST /upload'); // Log route handling

    const { user, image, contentType, question } = req.body; // Include 'question' field

    // Check if required fields are received
    if (!image || !user || !contentType || !question) {
        console.error('Validation error:', { image, user, contentType, question });
        return res.status(400).json({ error: 'Image, user, contentType, and question are required' });
    }

    try {
        // Convert base64 string to binary and save to MongoDB
        const newQuestion = new Question({
            user,
            question,
            image: Buffer.from(image, 'base64'),
            contentType,
            responses: [] // Initialize responses array
        });

        await newQuestion.save();
        console.log('Image uploaded successfully:', newQuestion);
        return res.status(200).json({ message: 'Image uploaded successfully', questionId: newQuestion._id }); // Include questionId
    } catch (error) {
        console.error('Error saving image:', error);
        return res.status(500).json({ error: 'Failed to upload image from route file' });
    }
});

// Retrieve images route
router.get('/images', async (req, res) => {
    console.log('Handling GET /images'); // Log route handling
    try {
        const questions = await Question.find();
        const formattedImages = questions.map(q => ({
            id: q._id,
            user: q.user,
            question: q.question,
            image: q.image.toString('base64'),
            contentType: q.contentType,
        }));
        // console.log('Fetched images:', formattedImages);
        return res.status(200).json(formattedImages);
    } catch (error) {
        console.error('Error fetching images:', error);
        return res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Send response route (using questionId and adding questionNumber)
router.post('/send-response', async (req, res) => {
    console.log('Handling POST /send-response'); // Log the request
    const { questionId, response } = req.body;

    console.log(questionId, response);

    // Validate input
    if (!questionId || !response) {
        console.log('Missing questionId or response:', { questionId, response });
        return res.status(400).json({ error: 'questionId and response are required' });
    }

    try {
        // Fetch the question to get its question key (this will be the questionNumber in the Response schema)
        const questionRecord = await Question.findById(questionId);
        if (!questionRecord) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Create a new response entry in the database with questionNumber
        const newResponse = new Response({
            questionId,
            questionNumber: questionRecord.question, // Use the question field as questionNumber
            response
        });

        await newResponse.save();
        console.log('Response saved successfully:', newResponse); // Log the successful save
        return res.status(200).json({ message: 'Response saved successfully' });
    } catch (error) {
        console.error('Error sending response:', error); // Log the error
        return res.status(500).json({ error: 'Failed to send response from route file' });
    }
});

// Retrieve responses by question ID
router.get('/response/:questionId', async (req, res) => {
    const { questionId } = req.params;
    console.log(questionId, '--------------------------');
    try {
        const responses = await Response.find({ questionId });
        console.log(responses, '-----------------------------------------');
        return res.status(200).json(responses);
    } catch (error) {
        console.error('Error fetching responses:', error);
        return res.status(500).json({ error: 'Failed to fetch responses' });
    }
});

// New endpoint: Retrieve responses by question number
router.get('/response2/:questionNumber', async (req, res) => {
    const { questionNumber } = req.params;
    console.log(questionNumber, '--------------------------');
    try {
        // Find responses based on questionNumber
        const responses = await Response.find({ questionNumber });
        console.log(responses, '-----------------------------------------');
        return res.status(200).json(responses);
    } catch (error) {
        console.error('Error fetching responses by question number:', error);
        return res.status(500).json({ error: 'Failed to fetch responses by question number' });
    }
});

// Delete image route
router.delete('/images/:id', async (req, res) => {
    console.log('Handling DELETE /images/:id'); // Log route handling
    const { id } = req.params;

    try {
        await Question.findByIdAndDelete(id);
        console.log('Image deleted successfully for ID:', id);
        return res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        return res.status(500).json({ error: 'Failed to delete image' });
    }
});

module.exports = router;


