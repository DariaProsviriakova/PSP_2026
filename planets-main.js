import { ajax } from './modules/ajax.js';
import { planetUrls } from './modules/planetUrls.js';

console.log('planets-main.js загружен - ЛР5 (без сохранения)');

let allPlanets = [];
let currentFilter = '';
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

function showModal(title, content, showConfirmBtn = true) {
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.className = 'modal-overlay';

    modal.innerHTML = `
        <div class="modal-content-custom">
            <h3>${title}</h3>
            <div class="modal-text">${content}</div>
            <div class="modal-buttons">
                ${showConfirmBtn ? '<button class="modal-confirm btn btn-primary">Закрыть</button>' : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    if (showConfirmBtn) {
        document.querySelector('.modal-confirm').onclick = () => modal.remove();
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
        showModal(`🪐 ${planet.name}`, content);
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
            <h3>✏️ Редактировать ${planet.name}</h3>
            <p style="color: #888; font-size: 12px; margin-bottom: 10px;">
                ⚠️ В 5-й лабораторной сохранение отключено. Кнопка появится в 6-й ЛР.
            </p>
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
            <h3>➕ Добавить новую планету</h3>
            <p style="color: #888; font-size: 12px; margin-bottom: 10px;">
                ⚠️ В 5-й лабораторной добавление отключено. Кнопка появится в 6-й ЛР.
            </p>
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

function filterPlanetsBySearchTerm(searchTerm) {
    const url = searchTerm ? `${planetUrls.getPlanets()}?name=${encodeURIComponent(searchTerm)}` : planetUrls.getPlanets();
    
    return new Promise((resolve, reject) => {
        ajax.get(url, (data, status) => {
            console.log(`GET ${url} - статус:`, status);
            if (status === 200 && data) {
                resolve(data);
            } else {
                reject(new Error(`HTTP error! status: ${status}`));
            }
        });
    });
}

async function applyFiltersAndRender() {
    const searchTerm = document.getElementById('searchInput')?.value || '';
    
    try {
        let filteredPlanets = await filterPlanetsBySearchTerm(searchTerm);
        
        const limit = currentLimit;
        const limitedPlanets = filteredPlanets.slice(0, limit);
        
        renderPlanetsToDOM(limitedPlanets, filteredPlanets.length, searchTerm);
    } catch (error) {
        console.error('Ошибка фильтрации:', error);
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="container mt-5">
                    <div class="alert alert-danger text-center">
                        ❌ Ошибка загрузки. Убедитесь, что бэкенд запущен и CORS Unblock включен.
                    </div>
                </div>
            `;
        }
    }
}

function renderPlanetsToDOM(planets, totalFiltered, searchTerm) {
    const app = document.getElementById('app');
    
    if (!planets || planets.length === 0) {
        app.innerHTML = `
            <div class="container mt-5">
                <div class="filter-panel card p-3 mb-4">
                    <div class="row align-items-end">
                        <div class="col-md-5">
                            <label for="searchInput" class="form-label">🔍 Поиск по названию (query-параметр name):</label>
                            <input type="text" id="searchInput" class="form-control" placeholder="Введите название планеты..." value="${searchTerm}">
                        </div>
                        <div class="col-md-3">
                            <label for="limitInput" class="form-label">📄 Количество планет:</label>
                            <input type="number" id="limitInput" class="form-control" value="${currentLimit}" min="1" max="20">
                        </div>
                        <div class="col-md-4">
                            <button id="addPlanetBtn" class="btn btn-outline-primary w-100 mb-2">➕ Добавить планету (форма без сохранения)</button>
                            <button id="applyFilterBtn" class="btn btn-primary w-100">🔍 Применить фильтр (GET ?name=...)</button>
                        </div>
                    </div>
                </div>
                <div class="alert alert-info text-center">
                    😔 Нет планет, соответствующих критериям поиска
                </div>
            </div>
        `;
        setupEventListeners(searchTerm);
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
                        <button class="btn btn-info btn-sm view-btn" data-id="${planet.id}">📖 Просмотр (GET /planets/:id)</button>
                        <button class="btn btn-warning btn-sm edit-btn" data-id="${planet.id}">✏️ Редактировать (форма без сохранения)</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${planet.id}">🗑️ Удалить (DELETE)</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    app.innerHTML = `
        <div class="container mt-5">
            <h1 class="text-center mb-4">🌍 Планеты Солнечной системы</h1>
            
            <div class="filter-panel card p-3 mb-4">
                <div class="row align-items-end">
                    <div class="col-md-5">
                        <label for="searchInput" class="form-label">🔍 Поиск по названию (query-параметр name):</label>
                        <input type="text" id="searchInput" class="form-control" placeholder="Введите название планеты..." value="${searchTerm}">
                    </div>
                    <div class="col-md-3">
                        <label for="limitInput" class="form-label">📄 Количество планет (пагинация):</label>
                        <input type="number" id="limitInput" class="form-control" value="${currentLimit}" min="1" max="20">
                    </div>
                    <div class="col-md-4">
                        <button id="addPlanetBtn" class="btn btn-outline-primary w-100 mb-2">➕ Добавить планету (форма без сохранения)</button>
                        <button id="applyFilterBtn" class="btn btn-primary w-100">🔍 Применить фильтр (GET ?name=...)</button>
                    </div>
                </div>
            </div>
            
            <div class="filter-info alert alert-secondary">
                <strong>📊 Результаты:</strong> 
                Найдено: ${totalFiltered} | Показано: ${Math.min(totalFiltered, currentLimit)} |
                ${searchTerm ? `Поиск: "${searchTerm}" → GET /planets?name=${encodeURIComponent(searchTerm)}` : 'Без фильтра → GET /planets'}
            </div>
            
            <div class="row" id="planetsRow">
                ${planetsHTML}
            </div>
        </div>
    `;
    
    setupEventListeners(searchTerm);
}

function setupEventListeners(searchTerm) {
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
            if (confirm('Удалить планету?')) {
                try {
                    await deletePlanet(btn.dataset.id);
                    alert('Планета удалена!');
                    applyFiltersAndRender();
                } catch (error) {
                    alert('Ошибка удаления');
                }
            }
        });
    });
    
    const applyBtn = document.getElementById('applyFilterBtn');
    const searchInput = document.getElementById('searchInput');
    const limitInput = document.getElementById('limitInput');
    
    if (applyBtn) {
        applyBtn.onclick = () => {
            currentLimit = parseInt(limitInput?.value) || 4;
            applyFiltersAndRender();
        };
    }
    
    if (searchInput) {
        searchInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                currentLimit = parseInt(limitInput?.value) || 4;
                applyFiltersAndRender();
            }
        };
    }
    
    if (limitInput) {
        limitInput.onchange = () => {
            currentLimit = parseInt(limitInput.value) || 4;
            applyFiltersAndRender();
        };
    }
    
    const addBtn = document.getElementById('addPlanetBtn');
    if (addBtn) {
        addBtn.onclick = showAddForm;
    }
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
        currentLimit = 4;
        currentFilter = '';
        await applyFiltersAndRender();
    } catch (error) {
        console.error('Ошибка:', error);
        app.innerHTML = `
            <div class="container mt-5">
                <div class="alert alert-danger text-center">
                    ❌ Ошибка: ${error.message}<br>
                    1. Запустите бэкенд: cd planet-backend && npm run start<br>
                    2. Включите расширение CORS Unblock в Chrome
                </div>
            </div>
        `;
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
    console.log('ЛР5 запущена - AJAX запросы, фильтрация, без сохранения');
    initTheme();
    setupThemeToggle();
    renderPlanets();
});