export const planetsData = {
    mars: {
        id: "mars",
        name: "Марс",
        modelPath: "./models/mars.glb",
        color: 0xff6b6b,
        description: "Красная планета, четвертая от Солнца"
    },
    jupiter: {
        id: "jupiter",
        name: "Юпитер",
        modelPath: "./models/jupiter.glb",
        color: 0xd4a574,
        description: "Самая большая планета Солнечной системы"
    },
    saturn: {
        id: "saturn",
        name: "Сатурн",
        modelPath: "./models/saturn.glb",
        color: 0xe8d4a8,
        description: "Планета с знаменитыми кольцами"
    },
    earth: {
        id: "earth",
        name: "Земля",
        modelPath: "./models/earth.glb",
        color: 0x4a90e2,
        description: "Наш дом"
    },
    venus: {
        id: "venus",
        name: "Венера",
        modelPath: "./models/venus.glb",
        color: 0xe6b856,
        description: "Самая горячая планета"
    },
    mercury: {
        id: "mercury",
        name: "Меркурий",
        modelPath: "./models/mercury.glb",
        color: 0xa8a8a8,
        description: "Самая близкая к Солнцу планета"
    }
};

export function getPlanetData(planetId) {
    return planetsData[planetId] || null;
}

export function getAllPlanets() {
    return Object.values(planetsData);
}