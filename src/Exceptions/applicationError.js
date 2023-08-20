class ApplicationError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'ApplicationError';
        this.statusCode = statusCode || 500; // Default to Internal Server Error status code
    }
}

module.exports = ApplicationError;
