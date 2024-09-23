const express = require('express');
const {
  addVacation,
  fetchVacations
} = require('../controller/vacationController');
const router = express.Router();

router.post('/create', addVacation);
router.get('/fetchVacations', fetchVacations);


module.exports = router;