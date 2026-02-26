const CustomError = require('../utilities/error.utilities');

// Global error handler
const globalErrorHandler = (error, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(error.stack);
    } 

    if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
            message: error.message
        })
    };

    res.status(500).json({
        success: false,
        message: 'An unexpected error occured.'
    });
};

module.exports = globalErrorHandler;