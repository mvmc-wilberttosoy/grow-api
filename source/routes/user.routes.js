const router = require('express').Router();
const { 
    createNewUser, 
    getEmployees
} = require('../controllers/user.controller');

router.post('/', createNewUser);
router.get('/', getEmployees);


module.exports = router;