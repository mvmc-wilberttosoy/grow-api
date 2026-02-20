const CustomError = require('../utilities/error.utilities');

const validateRequiredFields = (data, requiredFields) => {
    for (const field of requiredFields) {
        if (!data[field]) {
            throw new CustomError(`Please provide the required field: ${field}`, 400);
        }
    }
};


// Generate random password
const generateRandomPassword = () => {
    length = 12;
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$?';

    // Combine all character set into one string.
    const allCharacters = lowercase + uppercase + numbers + specialChars;

    let randomPassword = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        randomPassword = randomPassword + allCharacters[randomIndex];
    };

    return randomPassword;
}

module.exports = {
    validateRequiredFields,
    generateRandomPassword
}

