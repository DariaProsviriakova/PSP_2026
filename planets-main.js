const API_URL = 'http://localhost:3000/planets';

const planetsDataBackup = {
    mars: {
        id: "mars",
        name: "Марс",
        description: "Красная планета, четвертая от Солнца"
    },
    jupiter: {
        id: "jupiter",
        name: "Юпитер",
        description: "Самая большая планета Солнечной системы"
    },
    saturn: {
        id: "saturn",
        name: "Сатурн",
        description: "Планета с знаменитыми кольцами"
    },
    earth: {
        id: "earth",
        name: "Земля",
        description: "Наш дом"
    },
    venus: {
        id: "venus",
        name: "Венера",
        description: "Самая горячая планета"
    },
    mercury: {
        id: "mercury",
        name: "Меркурий",
        description: "Самая близкая к Солнцу планета"
    }
};

async function getAllPlanets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки с сервера, использую резервные данные:', error);
        return Object.values(planetsDataBackup);
    }
}

async function getPlanetData(planetId) {
    try {
        const response = await fetch(`${API_URL}/${planetId}`);
        if (!response.ok) return planetsDataBackup[planetId] || null;
        return await response.json();
    } catch (error) {
        return planetsDataBackup[planetId] || null;
    }
}

async function createPlanet(planetData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planetData)
    });
    if (!response.ok) throw new Error('Ошибка создания');
    return await response.json();
}

async function updatePlanet(planetId, planetData) {
    const response = await fetch(`${API_URL}/${planetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planetData)
    });
    if (!response.ok) throw new Error('Ошибка обновления');
    return await response.json();
}

async function deletePlanet(planetId) {
    const response = await fetch(`${API_URL}/${planetId}`, {
        method: 'DELETE'
    });
    if (!response.ok && response.status !== 204) throw new Error('Ошибка удаления');
    return true;
}

function showModal(title, content, onConfirm = null) {
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'custom-modal';

    modal.innerHTML = `
        <div class="modal-content">
            <h3>${title}</h3>
            <div class="modal-text">${content}</div>
            <div class="modal-buttons">
                <button class="modal-confirm">OK</button>
                ${onConfirm ? '<button class="modal-cancel">Отмена</button>' : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.querySelector('.modal-confirm').onclick = () => {
        if (onConfirm) onConfirm();
        modal.remove();
    };

    if (onConfirm) {
        document.querySelector('.modal-cancel').onclick = () => modal.remove();
    }
}

async function showPlanetDetails(id) {
    const planet = await getPlanetData(id);
    if (planet) {
        const content = `
            <div style="text-align: left;">
                <p><strong> Название:</strong> ${planet.name}</p>
                <p><strong> Описание:</strong> ${planet.description}</p>
                <p><strong> ID:</strong> ${planet.id}</p>
            </div>
        `;
        showModal(` ${planet.name}`, content);
    } else {
        showModal('Ошибка', 'Планета не найдена!');
    }
}

function showEditForm(planet) {
    const modal = document.createElement('div');
    modal.id = 'custom-modal';

    modal.innerHTML = `
        <div class="form-content">
            <h3>Редактировать ${planet.name}</h3>
            <input type="text" id="edit-name" value="${planet.name}" placeholder="Название" class="form-input">
            <textarea id="edit-description" placeholder="Описание" class="form-textarea">${planet.description}</textarea>
            <div class="form-buttons">
                <button id="edit-save" class="form-save">Сохранить</button>
                <button id="edit-cancel" class="form-cancel">Отмена</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('edit-save').onclick = async () => {
        const newName = document.getElementById('edit-name').value;
        const newDescription = document.getElementById('edit-description').value;

        if (!newName || !newDescription) {
            showModal('Ошибка', 'Заполните все поля!');
            return;
        }

        await updatePlanet(planet.id, { name: newName, description: newDescription });
        modal.remove();
        showModal('Успех', 'Планета обновлена!');
        renderPlanets();
    };

    document.getElementById('edit-cancel').onclick = () => modal.remove();
}

function showAddForm() {
    const modal = document.createElement('div');
    modal.id = 'custom-modal';

    modal.innerHTML = `
        <div class="form-content">
            <h3>Добавить новую планету</h3>
            <input type="text" id="add-id" placeholder="ID (например: neptune)" class="form-input">
            <input type="text" id="add-name" placeholder="Название" class="form-input">
            <textarea id="add-description" placeholder="Описание" class="form-textarea"></textarea>
            <div class="form-buttons">
                <button id="add-save" class="form-save">Добавить</button>
                <button id="add-cancel" class="form-cancel">Отмена</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('add-save').onclick = async () => {
        const id = document.getElementById('add-id').value;
        const name = document.getElementById('add-name').value;
        const description = document.getElementById('add-description').value;

        if (!id || !name || !description) {
            showModal('Ошибка', 'Заполните все поля!');
            return;
        }

        await createPlanet({ id, name, description });
        modal.remove();
        renderPlanets();
    };

    document.getElementById('add-cancel').onclick = () => modal.remove();
}

async function renderPlanets() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Загрузка планет...</p>
        </div>
    `;

    const planets = await getAllPlanets();

    const planetsHTML = planets.map(planet => `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card h-100">
                <div class="card-header" data-id="${planet.id}">
                    <h5 class="planet-title">${planet.name}</h5>
                </div>
                <div class="card-body">
                    <p class="card-text">${planet.description.substring(0, 80)}${planet.description.length > 80 ? '...' : ''}</p>
                    <div class="button-group">
                        <button class="view-btn" data-id="${planet.id}"> Подроб.</button>
                        <button class="edit-btn" data-id="${planet.id}"> Ред.</button>
                        <button class="delete-btn" data-id="${planet.id}"> Удалить</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    app.innerHTML = `
        <div class="container mt-5">
            <h1> Планеты Солнечной системы</h1>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <button id="addPlanetBtn" class="add-planet-btn">
                     Добавить новую планету 
                </button>
            </div>
            
            <div class="row">
                ${planetsHTML}
            </div>
        </div>
    `;

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPlanetDetails(btn.dataset.id);
        });
    });

    document.querySelectorAll('.edit-btn').forEach(async btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const planet = await getPlanetData(btn.dataset.id);
            if (planet) showEditForm(planet);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            showModal('Подтверждение', `Удалить планету?`, async () => {
                await deletePlanet(btn.dataset.id);
                showModal('Успех', 'Планета удалена!');
                renderPlanets();
            });
        });
    });

    document.querySelectorAll('.image-container').forEach(container => {
        container.addEventListener('click', () => {
            showPlanetDetails(container.dataset.id);
        });
    });

    document.getElementById('addPlanetBtn').onclick = showAddForm;
}

document.addEventListener('DOMContentLoaded', renderPlanets);