const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();
app.use(cors())
app.use(express.json());

const routes = require('./routes/routes');

app.use('/api', routes)

app.get('/', async (req, res) => {
    res.status(200).json({message: "Status-OK", status: 200})
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});