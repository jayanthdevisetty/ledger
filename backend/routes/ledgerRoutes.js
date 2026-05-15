const express = require('express');
const router = express.Router();
const { getPersonLedger, getAllPersons } = require('../controllers/ledgerController');

router.get('/', getAllPersons);
router.get('/:personName', getPersonLedger);

module.exports = router;
