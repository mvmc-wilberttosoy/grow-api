const router = require('express').Router();
const {
    getUserTouchpointByUserId,
    getAllTouchpoints,
    getUserTouchpoints
} = require('../controllers/touchpoint.controller');

router.get('/:employeeId', getUserTouchpointByUserId);
router.get('/', getAllTouchpoints);
router.get('/employee/:id', getUserTouchpoints);

module.exports = router;