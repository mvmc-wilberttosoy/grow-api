require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const connectToDatabase = require('./source/configurations/database');

connectToDatabase();

app.use(express.json());


app.use('/v1/api/division', require('./source/routes/division.routes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})