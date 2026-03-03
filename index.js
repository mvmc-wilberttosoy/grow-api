require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const connectToDatabase = require('./source/configurations/database');
const corsOptions = require('./source/configurations/cors');
const globalErrorHandler = require('./source/middlewares/error.middlewares');

connectToDatabase();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', require('./source/routes/auth.routes'));
app.use('/api/v1/users', require('./source/routes/user.routes'));
app.use('/api/v1/divisions', require('./source/routes/division.routes'));
app.use('/api/v1/departments', require('./source/routes/department.routes'));
app.use('/api/v1/touchpoints', require('./source/routes/touchpoint.routes'));

app.use(globalErrorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})