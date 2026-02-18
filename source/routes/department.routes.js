const router = require('express').Router();
const {
    createNewDepartment,
    getDepartments,
    getDepartmentByDivisionIdAndId,
    updateDepartmentByDivisionIdAndId,
    deleteDepartmentByDivisionIdAndId
} = require('../controllers/department.controller');

router.post('/', createNewDepartment);
router.get('/', getDepartments);
router.get('/division/:divisionId/department/:departmentId', getDepartmentByDivisionIdAndId);
router.put('/division/:divisionId/department/:departmentId', updateDepartmentByDivisionIdAndId);
router.delete('/division/:divisionId/department/:departmentId', deleteDepartmentByDivisionIdAndId);

module.exports = router;