const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (name) => {
    const planets = fileService.readData(dataFilePath);
    if (name) {
        return planets.filter(planet => 
            planet.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    return planets;
};

const findOne = (id) => {
    const planets = fileService.readData(dataFilePath);
    return planets.find(planet => planet.id === id);
};

const create = (planetData) => {
    const planets = fileService.readData(dataFilePath);
    
    if (planets.find(p => p.id === planetData.id)) {
        return null;
    }
    
    planets.push(planetData);
    fileService.writeData(dataFilePath, planets);
    
    return planetData;
};

const update = (id, planetData) => {
    const planets = fileService.readData(dataFilePath);
    const index = planets.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    planets[index] = { ...planets[index], ...planetData, id: planets[index].id };
    fileService.writeData(dataFilePath, planets);
    
    return planets[index];
};

const remove = (id) => {
    const planets = fileService.readData(dataFilePath);
    const filteredPlanets = planets.filter(p => p.id !== id);
    
    if (filteredPlanets.length === planets.length) {
        return false;
    }
    
    fileService.writeData(dataFilePath, filteredPlanets);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };