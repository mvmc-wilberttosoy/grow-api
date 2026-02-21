const router = require('express').Router();
const {
    login,
    refreshAccessToken,
    logout
} = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);

module.exports = router;