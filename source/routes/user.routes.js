const router = require('express').Router();
const { 
    createNewUser, 
    getEmployees,
    getEmployeeById,
    getEmployeesByDivisionId,
    getEmployeesByDivisionIdAndDepartmentId,
    updateEmployeeById,
    deleteEmployeeById,
    updateUserDefaultPassword
} = require('../controllers/user.controller');

router.post('/', createNewUser);
router.get('/', getEmployees);
router.put('/newpassword', updateUserDefaultPassword);

router.get('/:employeeId', getEmployeeById);
router.put('/:employeeId', updateEmployeeById);
router.delete('/:employeeId', deleteEmployeeById);

router.get('/division/:divisionId', getEmployeesByDivisionId);
router.get('/division/:divisionId/department/:departmentId', getEmployeesByDivisionIdAndDepartmentId);

module.exports = router;