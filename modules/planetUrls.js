class PlanetUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getPlanets() {
        return `${this.baseUrl}/planets`;
    }

    getPlanetById(id) {
        return `${this.baseUrl}/planets/${id}`;
    }

    createPlanet() {
        return `${this.baseUrl}/planets`;
    }

    removePlanetById(id) {
        return `${this.baseUrl}/planets/${id}`;
    }

    updatePlanetById(id) {
        return `${this.baseUrl}/planets/${id}`;
    }
}

export const planetUrls = new PlanetUrls();