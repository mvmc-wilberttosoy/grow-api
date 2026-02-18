const router = require('express').Router();
const { createNewDivision, getDivisions, getDivisionById } = require('../controllers/division.controller');

router.post('/', createNewDivision);
router.get('/', getDivisions);
router.get('/:divisionId', getDivisionById);

module.exports = router;