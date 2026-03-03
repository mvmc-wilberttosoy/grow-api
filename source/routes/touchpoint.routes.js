const router = require('express').Router();
const {
    getUserTouchpointByUserId
} = require('../controllers/touchpoint.controller');

router.get('/:employeeId', getUserTouchpointByUserId);

module.exports = router;