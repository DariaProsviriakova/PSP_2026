const planetsService = require('../services/planetsService');

const getAllPlanets = (req, res) => {
    const { name } = req.query;
    const planets = planetsService.findAll(name);
    res.json(planets);
};

const getPlanetById = (req, res) => {
    const id = req.params.id;
    const planet = planetsService.findOne(id);
    
    if (!planet) {
        return res.status(404).json({ error: 'Планета не найдена' });
    }
    
    res.json(planet);
};

const createPlanet = (req, res) => {
    const { id, name, modelPath, color, description } = req.body;
    
    if (!id || !name || !description) {
        return res.status(400).json({ error: 'id, name и description обязательны' });
    }
    
    const newPlanet = { 
        id, 
        name, 
        description 
    };
    const created = planetsService.create(newPlanet);
    
    if (!created) {
        return res.status(409).json({ error: 'Планета с таким id уже существует' });
    }
    
    res.status(201).json(created);
};

const updatePlanet = (req, res) => {
    const id = req.params.id;
    const updatedPlanet = planetsService.update(id, req.body);
    
    if (!updatedPlanet) {
        return res.status(404).json({ error: 'Планета не найдена' });
    }
    
    res.json(updatedPlanet);
};

const deletePlanet = (req, res) => {
    const id = req.params.id;
    const success = planetsService.remove(id);
    
    if (!success) {
        return res.status(404).json({ error: 'Планета не найдена' });
    }
    
    res.status(204).send();
};

module.exports = {
    getAllPlanets,
    getPlanetById,
    createPlanet,
    updatePlanet,
    deletePlanet
};