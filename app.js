const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const imageRoutes = require('./routes/imageRoutes');
require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(cors());

// Increase the limits for request bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static('public')); // Serve static files

// Log all incoming requests
// app.use((req, res, next) => {
//     console.log(`${req.method} request for '${req.url}'`);
//     next();
// });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error: ', err));

// Use image routes
app.use('/api', imageRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
