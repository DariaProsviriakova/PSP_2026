export class PlanetDetailComponent {
    constructor(parent) {
        this.parent = parent;
        this.currentViewer = null;
    }

    getHTML(data) {
        return `
            <div class="card planet-detail-card">
                <img src="${data.src}" class="card-img-top planet-detail-img" alt="${data.title}">
                <div class="card-body">
                    <h1 class="card-title planet-detail-title">${data.title}</h1>
                    <p class="card-text lead mt-4 planet-detail-text">${data.text}</p>
                    <hr>
                    <div id="planet-3d-${data.id}" style="width:100%; height:450px; background:#0a0a2a; border-radius:16px; overflow:hidden;"></div>
                </div>
            </div>
        `;
    }

    async render(data) {
        this.parent.innerHTML = this.getHTML(data);
        
        const container = document.getElementById(`planet-3d-${data.id}`);
        if (container) {
            try {
                const { Planet3DViewer } = await import('../../planet-3d-viewer.js');
                this.currentViewer = new Planet3DViewer(container, data.id, data.title, data.modelPath);
                await this.currentViewer.init();
            } catch (error) {
                console.error('Ошибка:', error);
                container.innerHTML = '<div style="text-align:center;padding:50px;color:white;">⚠️ Ошибка 3D</div>';
            }
        }
    }
    
    dispose() {
        if (this.currentViewer) {
            this.currentViewer.dispose();
        }
    }
}