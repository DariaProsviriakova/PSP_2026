export class PlanetDetailComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card planet-detail-card">
                <img src="${data.src}" class="card-img-top planet-detail-img" alt="${data.title}">
                <div class="card-body">
                    <h1 class="card-title planet-detail-title">${data.title}</h1>
                    <p class="card-text lead mt-4 planet-detail-text">${data.text}</p>
                    <hr class="planet-detail-hr">
                </div>
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}