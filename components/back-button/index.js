export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        const button = document.getElementById("back-button");
        if (button) {
            button.addEventListener("click", listener);
        }
    }

    getHTML() {
        return `
            <a id="back-button" class="btn btn-secondary mb-4 back-button">← Вернуться на главную</a>
        `;
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}