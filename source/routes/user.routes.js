const router = require('express').Router();
const { 
    createNewUser 
} = require('../controllers/user.controller');

router.post('/', createNewUser);

module.exports = router;