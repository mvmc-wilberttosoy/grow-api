const router = require('express').Router();
const {
    getEmployeesCompanyIds,
    getEmployeeCompanyId
} = require('../controllers/companyId.controller');

router.get('/', getEmployeesCompanyIds);
router.get('/:id', getEmployeeCompanyId);

module.exports = router;