const router = require('express').Router();
const {
    getEmployeesCompanyIds
} = require('../controllers/companyId.controller');

router.get('/', getEmployeesCompanyIds);

module.exports = router;