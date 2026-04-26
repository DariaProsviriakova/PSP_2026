const express = require('express');
const router = express.Router();
const planetsController = require('../controllers/planetsController');

router.get('/', planetsController.getAllPlanets);
router.get('/:id', planetsController.getPlanetById);
router.post('/', planetsController.createPlanet);
router.patch('/:id', planetsController.updatePlanet);
router.delete('/:id', planetsController.deletePlanet);

module.exports = router;