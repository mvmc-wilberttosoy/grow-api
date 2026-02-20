
// Custom Error
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
    }
}

module.exports = CustomError;