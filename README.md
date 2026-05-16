# 5 - Добаление AJAX запросов к API <!-- omit in toc -->

> Лабораторная работа 5 для студентов курса "Проектирование сетевых приложений" 4 семестра кафедры ИУ5 МГТУ им Н.Э. Баумана.

## Содержание <!-- omit in toc -->

- [Цель работы](#цель-работы)
- [Начало работы](#начало-работы)
- [Задание](#задание)
- [Указания по выполнению лабораторной работы](#указания-по-выполнению-лабораторной-работы)
    - [Требования к реализации](#требования-к-реализации)
    - [Структура проекта](#структура-проекта)
- [Пример программы](#пример-программы)
- [Результат работы](#результат-работы)

## Цель работы

 Взаимодействие с внешним API через XMLHttpRequest. В ходе выполнения работы, вам предстоит ознакомиться с кодом реализации простого взаимодействия с внешним API, получение данных и вывод их в интерфейс пользователя, и затем выполнить задания по варианту.

---

## Начало работы

Зайдите в свою локальную директорию с репозиторием для выполнения лабораторных работ. Заберите ветку с соответствующей лабораторной работой из общего репозитория:

```sh
git pull upstream
```

**или**

```sh
git pull upstream lab_5
```

Переключитесь на ветку с текущей лабораторной работой:

```sh
git checkout lab_5
```

Свяжите ветку локального репозитория с вашим удаленным репозиторием:

```sh
git push --set-upstream origin lab_5
```

## Задание

Продолжение Лабораторной работы 3: добавить страницу добавления/редактирования и соответствующие кнопки, подключение к созданному API бэкенду. Запросы XHR, Cors обойти через расширение браузера CORS Unblock. Код 4ой лабораторной НЕ НУЖНО добавлять в ветку по 5ой, в 5ой и 6ой остается только фронтенд, как в 3ей

---
## Указания по выполнению лабораторной работы

1. Работа с AJAX — используйте готовый класс `Ajax` из модуля `modules/ajax.js` для выполнения всех HTTP-запросов к серверу.
2. URL-эндпоинты — создайте класс `PlanetUrls` в отдельном файле, где хранятся все URL для обращения к API с базовым адресом `http://localhost:3000`.
3. Отрисовка карточек — удалите статический массив с данными и реализуйте отображение карточек на основе данных, полученных через AJAX-запрос к серверу.

---

## Требования к реализации

1. Добавить поле для ввода числа, ограничивающее количество отображаемых карточек (клиентская пагинация)
2. Все запросы к API выполнять через класс `Ajax` на основе XMLHttpRequest
3. Вынести URL-эндпоинты в отдельный класс `PlanetUrls`
4. Карточки должны отображаться из данных, полученных с сервера, а не из статичного объекта

---

## Структура проекта

![Фото 1](assets/photo_1.png)

---
## Пример программы

Класс Ajax для HTTP-запросов

```javascript
class Ajax {
    get(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }
}
```
Класс PlanetUrls с эндпоинтами

```javascript
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
}
```
Получение всех планет через AJAX

```javascript
function getAllPlanets() {
    return new Promise((resolve, reject) => {
        ajax.get(planetUrls.getPlanets(), (data, status) => {
            if (status === 200 && data) {
                resolve(data);
            } else {
                reject(new Error(`HTTP error! status: ${status}`));
            }
        });
    });
}
```

Удаление планеты через DELETE-запрос

```javascript
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
```
Отрисовка карточек из полученных данных

```javascript
async function renderPlanets() {
    try {
        allPlanets = await getAllPlanets();
        const planetsHTML = allPlanets.map(planet => `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card">
                    <h5>${planet.name}</h5>
                    <p>${planet.description}</p>
                    <button class="view-btn" data-id="${planet.id}">Просмотр</button>
                </div>
            </div>
        `).join('');
        document.getElementById('app').innerHTML = planetsHTML;
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
```
---

## Результат работы

![Фото 2](assets/photo_2.png)
![Фото 3](assets/photo_3.png)
![Фото 4](assets/photo_4.png)

---