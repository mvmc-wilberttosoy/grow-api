const router = require('express').Router();
const {
    getUserTouchpointByUserId,
    getAllTouchpoints
} = require('../controllers/touchpoint.controller');

router.get('/:employeeId', getUserTouchpointByUserId);
router.get('/', getAllTouchpoints);

module.exports = router;