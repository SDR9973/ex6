const express = require('express');
const {
  addVacation,
} = require('../controller/vacationController');
const router = express.Router();

router.post('/create', addVacation);


module.exports = router;