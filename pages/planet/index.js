import { BackButtonComponent } from '../../components/back-button/index.js';
import { PlanetDetailComponent } from '../../components/planet-detail/index.js';
import { MainPage } from '../main/index.js';

export class PlanetPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    get pageRoot() {
        return document.getElementById('planet-page');
    }

    getHTML() {
        return `
            <div id="planet-page">
                <div class="container my-5">
                    <div class="row">
                        <div class="col-md-8 mx-auto">
                            <div id="planet-detail-container"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getData() {
        const planets = {
            mars: {
                id: "mars",
                src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMfPEoNsnNTx3qT3B6LY0twJDKfa9rOijViw&s",
                title: "Марс",
                text: "Марс — четвёртая планета от Солнца. Названа в честь древнеримского бога войны. На Марсе находится самая высокая гора в Солнечной системе — вулкан Олимп (21 км). Температура на поверхности колеблется от -153°C до +20°C. У Марса есть два спутника: Фобос и Деймос."
            },
            jupiter: {
                id: "jupiter",
                src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxltsnIy7ZmDBlievWQFGJMHKMVlc5NiE8Ww&s",
                title: "Юпитер",
                text: "Юпитер — самая большая планета Солнечной системы. Его масса в 2,5 раза больше массы всех остальных планет вместе взятых. Юпитер состоит из водорода и гелия. Большое красное пятно — гигантский шторм, который бушует более 300 лет. У Юпитера 79 известных спутников."
            },
            saturn: {
                id: "saturn",
                src: "https://png.pngtree.com/thumb_back/fh260/background/20230611/pngtree-saturn-with-two-rings-on-the-planet-image_2944627.jpg",
                title: "Сатурн",
                text: "Сатурн — шестая планета от Солнца, известная своей системой колец. Кольца состоят из льда и камней. Сатурн — наименее плотная планета. У Сатурна 82 подтверждённых спутника, самый крупный — Титан, который больше планеты Меркурий."
            }
        };
        return planets[this.id];
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        const container = document.getElementById('planet-detail-container');
        const data = this.getData();
        const planetDetail = new PlanetDetailComponent(container);
        planetDetail.render(data);
    }
}