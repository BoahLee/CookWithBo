import axios from 'axios';
import { app_id, key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://api.edamam.com/search?r=${this.id}&app_id=${app_id}&app_key=${key}`);
            
            this.title = res.data[0].label;
            this.source = res.data[0].source;
            this.img = res.data[0].image;
            this.url = res.data[0].url;
            this.ingredients = res.data[0].ingredients;
            console.log(res);
            // console.log(this.title);
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(')
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }
}