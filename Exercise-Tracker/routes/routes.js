const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllers.js');


router.post('/users', controller.createUser);
router.get('/users', controller.getAllUser);
router.post('/users/:_id/exercises', controller.createExercise);
router.get('/users/:_id/logs', controller.getAllLogs);




module.exports = router;