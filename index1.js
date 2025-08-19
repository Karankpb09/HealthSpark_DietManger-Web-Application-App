const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'pagesohtml')));


async function connectdb() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}
connectdb();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pagesohtml', 'registration.html'));
});

app.get('/recommd', (req, res) => {
    res.sendFile(path.join(__dirname, 'pagesohtml', 'recommd.html'));
});

app.post('/saveData', async (req, res) => {
    try {
        const db = client.db("ProjectiBase");
        const collection = db.collection("newhealth");
        await collection.insertOne(req.body);
        res.send("<h1>Data Saved Successfully!</h1>");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving data");
    }
});

process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});