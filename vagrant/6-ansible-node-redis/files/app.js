const express = require('express');
const redis = require('redis');
const app = express();

// IP of the Redis server
const client = redis.createClient({ host: '192.168.56.72' });

app.get('/', (req, res) => {
    client.incr('visits', (err, visits) => {
        if (err) {
            console.error("Error accessing Redis:", err);
            res.send("Error accessing the visit counter.");
            return;
        }
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Visit Counter</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f0f0f0;
                        color: #333;
                    }
                    .container {
                        text-align: center;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        background-color: #fff;
                    }
                    h1 {
                        font-size: 2em;
                        margin: 0;
                    }
                    p {
                        font-size: 1.5em;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Page Visits</h1>
                    <p>This page has been visited <strong>${visits}</strong> times!</p>
                </div>
            </body>
            </html>
        `);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});