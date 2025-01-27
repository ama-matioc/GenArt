const express = require('express');
const mysql = require('mysql');
const cors= require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:  true}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ama1568',
    database: 'genart',
});



// Save generated image
app.post('/api/save-image', (req, res) => {
    const { imageUrl, prompt } = req.body;

    const query = 'INSERT INTO generated_images (image_url, prompt) VALUES (?, ?)';
    db.query(query, [imageUrl, prompt], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving image.');
        }
        res.status(200).send('Image saved successfully.');
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
        res.status(200).json(results);
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
