import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(ingredient) {
        const item = {
            id: uniqid(),
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }
}