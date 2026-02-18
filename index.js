require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const connectToDatabase = require('./source/configurations/database');

connectToDatabase();

app.use(express.json());

app.use('/api/v1/users', require('./source/routes/user.routes'));
app.use('/api/v1/divisions', require('./source/routes/division.routes'));
app.use('/api/v1/departments', require('./source/routes/department.routes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})