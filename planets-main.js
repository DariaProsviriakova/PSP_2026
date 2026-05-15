import { ajax } from './modules/ajax.js';
import { planetUrls } from './modules/planetUrls.js';

let allPlanets = [];
let currentLimit = 4;

function getAllPlanets() {
    return new Promise((resolve, reject) => {
        ajax.get(planetUrls.getPlanets(), (data, status) => {
            console.log('GET /planets - статус:', status);
            if (status === 200 && data) {
                resolve(data);
            } else {
                reject(new Error(`HTTP error! status: ${status}`));
            }
        });
    });
}

function getPlanetData(planetId) {
    return new Promise((resolve, reject) => {
        ajax.get(planetUrls.getPlanetById(planetId), (data, status) => {
            if (status === 200 && data) {
                resolve(data);
            } else {
                reject(new Error(`HTTP error! status: ${status}`));
            }
        });
    });
}

function deletePlanet(planetId) {
    return new Promise((resolve, reject) => {
        ajax.delete(planetUrls.removePlanetById(planetId), (data, status) => {
            if (status === 204 || status === 200) {
                resolve(true);
            } else {
                reject(new Error('Ошибка удаления'));
            }
        });
    });
}

function showModal(title, content, showConfirmBtn = true, showCancelBtn = false, onConfirm = null) {
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.className = 'modal-overlay';

    const cancelBtnHtml = showCancelBtn ? '<button class="modal-cancel btn btn-secondary">Отмена</button>' : '';
    
    modal.innerHTML = `
        <div class="modal-content-custom">
            <h3>${title}</h3>
            <div class="modal-text">${content}</div>
            <div class="modal-buttons">
                ${cancelBtnHtml}
                ${showConfirmBtn ? '<button class="modal-confirm btn btn-primary">Закрыть</button>' : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    if (showConfirmBtn) {
        const confirmBtn = document.querySelector('.modal-confirm');
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                if (onConfirm) onConfirm();
                modal.remove();
            };
        }
    }
    
    if (showCancelBtn) {
        const cancelBtn = document.querySelector('.modal-cancel');
        if (cancelBtn) {
            cancelBtn.onclick = () => modal.remove();
        }
    }
}

async function showPlanetDetails(id) {
    try {
        const planet = await getPlanetData(id);
        const content = `
            <div style="text-align: left;">
                <p><strong>Название:</strong> ${planet.name}</p>
                <p><strong>Описание:</strong> ${planet.description}</p>
                <p><strong>ID:</strong> ${planet.id}</p>
            </div>
        `;
        showModal(` ${planet.name}`, content);
    } catch (error) {
        showModal('Ошибка', 'Планета не найдена!');
    }
}

function showEditForm(planet) {
    const modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.className = 'modal-overlay';

    modal.innerHTML = `
        <div class="modal-content-custom form-modal">
            <h3>Редактировать ${planet.name}</h3>
            <input type="text" id="edit-name" value="${planet.name}" placeholder="Название" class="form-input">
            <textarea id="edit-description" placeholder="Описание" class="form-textarea">${planet.description}</textarea>
            <div class="modal-buttons">
                <button id="edit-close" class="btn btn-secondary">Закрыть</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('edit-close').onclick = () => modal.remove();
}

function showAddForm() {
    const modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.className = 'modal-overlay';

    modal.innerHTML = `
        <div class="modal-content-custom form-modal">
            <h3>Добавить новую планету</h3>
            <input type="text" id="add-id" placeholder="ID (например: neptune)" class="form-input" value="neptune">
            <input type="text" id="add-name" placeholder="Название" class="form-input" value="Нептун">
            <textarea id="add-description" placeholder="Описание" class="form-textarea">Восьмая планета от Солнца</textarea>
            <div class="modal-buttons">
                <button id="add-close" class="btn btn-secondary">Закрыть</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('add-close').onclick = () => modal.remove();
}

function showDeleteConfirm(planetId, planetName) {
    const modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.className = 'modal-overlay';

    modal.innerHTML = `
        <div class="modal-content-custom form-modal">
            <h3>Удалить планету?</h3>
            <div class="modal-text">Вы уверены, что хотите удалить планету "${planetName}"?</div>
            <div class="modal-buttons">
                <button id="delete-cancel" class="btn btn-secondary">Отмена</button>
                <button id="delete-confirm" class="btn btn-primary">Удалить</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    document.getElementById('delete-cancel').onclick = () => modal.remove();
    document.getElementById('delete-confirm').onclick = async () => {
        try {
            await deletePlanet(planetId);
            modal.remove();
            showModal('Успех', 'Планета успешно удалена!');
            renderPlanets();
        } catch (error) {
            modal.remove();
            showModal('Ошибка', 'Не удалось удалить планету');
        }
    };
}

async function renderPlanets() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container mt-5 text-center">
            <div class="loading-container">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
                <p class="mt-2">Загрузка планет...</p>
            </div>
        </div>
    `;
    
    try {
        allPlanets = await getAllPlanets();
        renderPlanetsToDOM(allPlanets);
    } catch (error) {
        console.error('Ошибка:', error);
        app.innerHTML = `
            <div class="container mt-5">
                <div class="alert alert-danger text-center">
                    Ошибка: ${error.message}<br>
                    1. Запустите бэкенд: cd planet-backend && npm run start<br>
                    2. Включите расширение CORS Unblock в Chrome
                </div>
            </div>
        `;
    }
}

function renderPlanetsToDOM(planets) {
    const app = document.getElementById('app');
    
    if (!planets || planets.length === 0) {
        app.innerHTML = `
            <div class="container mt-5">
                <div class="text-center text-muted">Планеты не найдены</div>
                <div class="add-planet-wrapper mt-3">
                    <button id="addPlanetBtn" class="btn btn-outline-primary"> Добавить планету</button>
                </div>
            </div>
        `;
        const addBtn = document.getElementById('addPlanetBtn');
        if (addBtn) {
            addBtn.onclick = showAddForm;
        }
        return;
    }
    
    const planetsHTML = planets.map(planet => `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card h-100 planet-card">
                <div class="card-header">
                    <h5 class="planet-title">${planet.name}</h5>
                </div>
                <div class="card-body">
                    <p class="card-text">${planet.description.substring(0, 80)}${planet.description.length > 80 ? '...' : ''}</p>
                    <div class="button-group">
                        <button class="btn btn-info btn-sm view-btn" data-id="${planet.id}">Просмотр</button>
                        <button class="btn btn-warning btn-sm edit-btn" data-id="${planet.id}">Редактировать</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${planet.id}">Удалить</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    app.innerHTML = `
        <div class="container mt-5">
            <h1 class="text-center mb-4">Планеты Солнечной системы</h1>
            
            <div class="add-planet-wrapper mb-4">
                <button id="addPlanetBtn" class="btn btn-outline-primary"> Добавить планету</button>
            </div>
            
            <div class="row" id="planetsRow">
                ${planetsHTML}
            </div>
        </div>
    `;
    
    setupEventListeners();
}

function setupEventListeners() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPlanetDetails(btn.dataset.id);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(async btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                const planet = await getPlanetData(btn.dataset.id);
                if (planet) showEditForm(planet);
            } catch (error) {
                showModal('Ошибка', 'Не удалось загрузить данные');
            }
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                const planet = await getPlanetData(btn.dataset.id);
                showDeleteConfirm(btn.dataset.id, planet.name);
            } catch (error) {
                showModal('Ошибка', 'Не удалось загрузить данные планеты');
            }
        });
    });
        
    const addBtn = document.getElementById('addPlanetBtn');
    if (addBtn) {
        addBtn.onclick = showAddForm;
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const themeIcon = document.getElementById('themeIcon');
            if (currentTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                if (themeIcon) themeIcon.textContent = '🌙';
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                if (themeIcon) themeIcon.textContent = '☀️';
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupThemeToggle();
    renderPlanets();
});