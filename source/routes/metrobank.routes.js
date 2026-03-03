const router = require('express').Router();
const {
    getMetrobanks
} = require('../controllers/metrobank.controller');

router.get('/', getMetrobanks);

module.exports = router;