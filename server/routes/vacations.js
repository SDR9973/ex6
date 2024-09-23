const express = require('express');
const {
  addVacation,
  fetchVacations,
  editVacation,
  deleteVacation
} = require('../controller/vacationController');

const router = express.Router();

router.post('/create', addVacation);

router.get('/fetchVacations', fetchVacations);

router.put('/edit/:id', editVacation);

router.delete('/delete/:id', deleteVacation);

module.exports = router;
