export class PlanetCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="col-md-4 mb-4 planet-card">
                <div class="card h-100">
                    <div class="image-container">
                        <img src="${data.src}" class="card-img-top planet-img" alt="${data.title}" data-id="${data.id}" data-title="${data.title}" data-src="${data.src}">
                        <div class="image-overlay"></div>
                        <div class="zoom-overlay">
                            <span>🔍</span>
                        </div>
                        <div class="planet-title-overlay">
                            <h3 class="planet-title" data-id="${data.id}"> ${data.title}</h3>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(data, clickHandler) {
        const titleElement = document.querySelector(`.planet-title[data-id="${data.id}"]`);
        if (titleElement) {
            titleElement.addEventListener("click", (e) => {
                e.stopPropagation();
                clickHandler(data.id);
            });
        }

        const imgElement = document.querySelector(`.planet-img[data-id="${data.id}"]`);
        const container = imgElement?.closest('.image-container');
        
        if (container) {
            const overlay = container.querySelector('.zoom-overlay');
            const imageOverlay = container.querySelector('.image-overlay');
            
            container.addEventListener('mouseenter', () => {
                if (overlay) overlay.style.opacity = '1';
                if (imageOverlay) imageOverlay.style.opacity = '1';
                if (imgElement) imgElement.style.transform = 'scale(1.08)';
            });
            
            container.addEventListener('mouseleave', () => {
                if (overlay) overlay.style.opacity = '0';
                if (imageOverlay) imageOverlay.style.opacity = '0';
                if (imgElement) imgElement.style.transform = 'scale(1)';
            });
            
            container.addEventListener('click', (e) => {
                if (!e.target.closest('.planet-title')) {
                    this.openLightbox(data.id);
                }
            });
        }
    }

    openLightbox(planetId) {
        const planets = this.getAllPlanets();
        let currentIndex = planets.findIndex(p => p.id === planetId);
        
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-nav prev-nav">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                
                <button class="lightbox-nav next-nav">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                
                <button class="lightbox-close">✕</button>
                
                <img id="lightbox-img" src="">
            </div>
            <div id="lightbox-title"></div>
        `;
        
        document.body.appendChild(lightbox);
        
        const imgElement = document.getElementById('lightbox-img');
        const titleElement = document.getElementById('lightbox-title');
        const prevBtn = lightbox.querySelector('.prev-nav');
        const nextBtn = lightbox.querySelector('.next-nav');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        
        const updateImage = () => {
            if (imgElement && titleElement && planets[currentIndex]) {
                imgElement.src = planets[currentIndex].src;
                titleElement.textContent = `${planets[currentIndex].title}`;
            }
        };
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + planets.length) % planets.length;
                updateImage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % planets.length;
                updateImage();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.remove();
            });
        }
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.remove();
            }
        });
        
        const keyHandler = (e) => {
            if (!document.getElementById('lightbox')) {
                document.removeEventListener('keydown', keyHandler);
                return;
            }
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + planets.length) % planets.length;
                updateImage();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % planets.length;
                updateImage();
            } else if (e.key === 'Escape') {
                lightbox.remove();
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        updateImage();
    }
    
    getAllPlanets() {
        return window.allPlanetsData || [
            {
                id: "mars",
                src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMfPEoNsnNTx3qT3B6LY0twJDKfa9rOijViw&s",
                title: "Марс"
            },
            {
                id: "jupiter",
                src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxltsnIy7ZmDBlievWQFGJMHKMVlc5NiE8Ww&s",
                title: "Юпитер"
            },
            {
                id: "saturn",
                src: "https://png.pngtree.com/thumb_back/fh260/background/20230611/pngtree-saturn-with-two-rings-on-the-planet-image_2944627.jpg",
                title: "Сатурн"
            }
        ];
    }

    render(data, clickHandler) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, clickHandler);
    }
}