import { PlanetCardComponent } from '../../components/planet-card/index.js';
import { PlanetPage } from '../planet/index.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `
            <div id="main-page">
                <h1>КОСМИЧЕСКИЕ ПЛАНЕТЫ</h1>
                <div class="container my-5">
                    <div class="row" id="planets-container"></div>
                </div>
            </div>
        `;
    }

    getData() {
        const planets = [
            {
                id: "mars",
                src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMfPEoNsnNTx3qT3B6LY0twJDKfa9rOijViw&s",
                title: "Марс",
                text: "Красная планета, четвёртая от Солнца. На Марсе находится самая высокая гора в Солнечной системе — Олимп."
            },
            {
                id: "jupiter",
                src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxltsnIy7ZmDBlievWQFGJMHKMVlc5NiE8Ww&s",
                title: "Юпитер",
                text: "Самая большая планета Солнечной системы, газовый гигант. Знаменитое Большое красное пятно — гигантский шторм."
            },
            {
                id: "saturn",
                src: "https://png.pngtree.com/thumb_back/fh260/background/20230611/pngtree-saturn-with-two-rings-on-the-planet-image_2944627.jpg",
                title: "Сатурн",
                text: "Планета, известная своими красивыми кольцами. Шестая планета от Солнца, газовый гигант."
            }
        ];
        
        window.allPlanetsData = planets.map(p => ({
            id: p.id,
            src: p.src,
            title: p.title
        }));
        
        return planets;
    }

    clickCard(cardId) {
        const planetPage = new PlanetPage(this.parent, cardId);
        planetPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const container = document.getElementById('planets-container');
        const data = this.getData();

        data.forEach((item) => {
            const planetCard = new PlanetCardComponent(container);
            planetCard.render(item, this.clickCard.bind(this));
        });
    }
}