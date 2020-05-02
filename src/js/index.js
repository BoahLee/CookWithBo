import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import { elements, renderLoader, clearLoader } from './views/base';


/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shoppong list object
 * - liked recipes
 */
const state = {};

// Search controller
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
            
        } catch (error) {
            alert('Something went wrong with the search!');
            clearLoader();
        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
    
})

// Recipe controller

// const rec = new Recipe(13196);
// rec.getRecipe();
// console.log(rec);

const controlRecipe = async() => {
    let c = {'#': '%23', ':': '%3A', '/': '%2F'}
    let id = window.location.hash.slice(1).replace(/[\#\:\/]/g, m => c[m]);

    if (id !== '') {
        // Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if (state.search) {
            searchView.highlightSelected(id);
        }
        
        // Create new recipe object
        state.recipe = new Recipe(id);
        try {
            // Get recipe data
            await state.recipe.getRecipe();
            state.recipe.ingredients = state.recipe.ingredients.map(el => el.text);
            //console.log(state.recipe.ingredients);

            // Parse ingredients;
            //state.recipe.parseIngredients();
            // Render recipe
            state.recipe.calcTime();
            state.recipe.calcServings();
            //console.log(state.recipe);

            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        } catch (error) {
            alert('Error processing recipe.')
        }
        
    }
};

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

// LIST CONTROLLER

const controlList = () => {
    // Create a new list if there is none yet
    if (!state.list) {
        state.list = new List();
    }

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el);       
        listView.renderItem(item);
    });
};

// LIKE CONTROLLER

const controlLikes = () => {
    if (!state.likes) {
        state.likes = new Likes();
    }

    const currentID = state.recipe.id;
    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.source,
            state.recipe.img
        )
        //Toggle the like button
        likesView.toggleLikeBtn(true);
        // Add like to the UI
        likesView.renderLike(newLike);

    } else {
        //Remove like to the state
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.toggleLikeBtn(false);
        //Remove like to the UI
        likesView.deleteLike(currentID);

    }

    likesView.toggleLikesMenu(state.likes.getNumLikes());
}


// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    //Restore likes
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikesMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));

})


// Handling delete event
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping_delete, .shopping__delete *')) {
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    } 
})


// Handling add shopping list
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.recipe__btn, .recipe__btn *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLikes();
    }
});