const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable file upload
app.use(fileUpload());

// Database configuration
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ama1568',
    database: 'genart',
});

// Save generated image
app.post('/api/save-image', (req, res) => {
    const { prompt } = req.body;
    const image = req.files?.image;

    if (!image) {
        return res.status(400).send('No image file uploaded.');
    }

    // Generate a unique filename
    const uniqueName = `${Date.now()}-${image.name}`;
    const imagePath = path.join(__dirname, 'uploads', uniqueName);

    image.mv(imagePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving file.');
        }

        // Store the filename in the database
        const query = 'INSERT INTO generated_images (image_url, prompt) VALUES (?, ?)';
        db.query(query, [uniqueName, prompt], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving image to database.');
            }
            res.status(200).send('Image saved successfully.');
        });
    });
});


// Fetch all images
app.get('/api/images', (req, res) => {
    const query = 'SELECT * FROM generated_images';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching images.');
        }

        // Add full URL for the images
        const updatedResults = results.map((image) => ({
            ...image,
            image_url: `${req.protocol}://${req.get('host')}/uploads/${image.image_url}`,
        }));

        res.status(200).json(updatedResults);
    });
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(3001, () => {
    console.log('Server running on port 3001');
});