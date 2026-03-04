const router = require('express').Router();
const {
    getUniforms
} = require('../controllers/uniform.controller');

router.get('/', getUniforms);

module.exports = router;