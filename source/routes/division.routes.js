const router = require('express').Router();
const { 
    createNewDivision, 
    getDivisions, 
    getDivisionById, 
    updateDivisionById, 
    deleteDivisionById
} = require('../controllers/division.controller');

router.post('/', createNewDivision);
router.get('/', getDivisions);
router.get('/:divisionId', getDivisionById);
router.put('/:divisionId', updateDivisionById)
router.delete('/:divisionId', deleteDivisionById);

module.exports = router;