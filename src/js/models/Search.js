import axios from 'axios';
import { key, proxy } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    

    async getResults() {

        const app_id = '27ccf422';
        const key = 'd4ed4c2b0fc035f3ff6aed1a69c4b8cb';
        try {

            const res = await axios(`https://api.edamam.com/search?q=${this.query}&app_id=${app_id}&app_key=${key}`);
            this.result = res.data.hits;
        //console.log(this.result);
        } catch (error){
            alert(error);
        }
}
}
