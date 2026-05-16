# 4 - Cоздание бэкенда на Express.js <!-- omit in toc -->

> Лабораторная работа 4 для студентов курса "Проектирование сетевых приложений" 4 семестра кафедры ИУ5 МГТУ им Н.Э. Баумана.

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

Освоить создание бэкенд-сервера на платформе Node.js с использованием фреймворка Express.js для разработки REST API.

---

## Начало работы

Зайдите в свою локальную директорию с репозиторием для выполнения лабораторных работ. Заберите ветку с соответствующей лабораторной работой из общего репозитория:

```sh
git pull upstream
```

**или**

```sh
git pull upstream lab_4
```

Переключитесь на ветку с текущей лабораторной работой:

```sh
git checkout lab_4
```

Свяжите ветку локального репозитория с вашим удаленным репозиторием:

```sh
git push --set-upstream origin lab_4
```

## Задание

Реализация на Node.js собственного веб-сервиса для API, данные хранятся в json файле. Тестирование через Postman/Insomnia 5 методов: список с фильтрацией, получение одной записи, добавление, редактирование, удаление

---
## Указания по выполнению лабораторной работы
1. Работа выполняется индивидуально в соответствии с вариантом
2. Код должен быть организован по слоистой архитектуре (routes → controllers → services)
3. Все эндпоинты должны быть протестированы через Postman или аналогичный инструмент
4. Проект должен быть загружен на GitHub

---

## Требования к реализации
1. Проект должен быть написан на Node.js с использованием фреймворка Express.js
2. Код должен быть организован по слоистой архитектуре (routes → controllers → services)
3. Все зависимости должны быть указаны в package.json
4. Код должен быть чистым, читаемым и сопровождаемым
5. Должна быть корректная обработка ошибок (try-catch, статус-коды)

---

## Структура проекта

![Фото 1](assets/photo_1.png)

---
## Пример программы

Запуск сервера

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());  // парсинг JSON
app.use(cors());          // разрешение кросс-доменных запросов

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
```
Чтение/запись файлов

```javascript
const readData = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const writeData = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
```
Логика основного кода

```javascript
const findAll = (name) => {
    const planets = fileService.readData(dataFilePath);
    if (name) {
        return planets.filter(p => 
            p.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    return planets;
};

const create = (planetData) => {
    const planets = fileService.readData(dataFilePath);
    planets.push(planetData);
    fileService.writeData(dataFilePath, planets);
    return planetData;
};
```
Контроллер 

```javascript
const getAllPlanets = (req, res) => {
    const { name } = req.query;
    const planets = planetsService.findAll(name);
    res.json(planets);
};

const createPlanet = (req, res) => {
    const { id, name, description } = req.body;
    if (!id || !name || !description) {
        return res.status(400).json({ error: 'Обязательные поля' });
    }
    const created = planetsService.create({ id, name, description });
    res.status(201).json(created);
};
```
Маршруты 

```javascript
const getAllPlanets = (req, res) => {
    const { name } = req.query;
    const planets = planetsService.findAll(name);
    res.json(planets);
};

const createPlanet = (req, res) => {
    const { id, name, description } = req.body;
    if (!id || !name || !description) {
        return res.status(400).json({ error: 'Обязательные поля' });
    }
    const created = planetsService.create({ id, name, description });
    res.status(201).json(created);
};
```
---

## Результат работы

![Фото 2](assets/photo_4.png)
![Фото 3](assets/photo_3.png)
![Фото 4](assets/photo_2.png)

---