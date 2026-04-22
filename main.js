import { MainPage } from './pages/main/index.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (app) {
        const mainPage = new MainPage(app);
        mainPage.render();
    }
});