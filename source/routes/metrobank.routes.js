const router = require('express').Router();
const {
    getMetrobanks,
    getMetrobank
} = require('../controllers/metrobank.controller');

router.get('/', getMetrobanks);
router.get('/:id', getMetrobank);

module.exports = router;