import { elements, elementStrings } from './base';


export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => el.classList.remove('results__link--active'));
    console.log(id);
    document.querySelector(`.results__link[href="${window.location.hash}"]`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = []
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(` `)} ...`;
    }
    return title;
}

const renderRecipe = rec => {
    const markup = `
    <li>
        <a class="results__link" href="#${rec.recipe.uri}">
            <figure class="results__fig">
                <img src="${rec.recipe.image}" alt="${rec.recipe.label}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(rec.recipe.label)}</h4>
                <p class="results__author">${rec.recipe.source}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResultList.insertAdjacentHTML("beforeend", markup);
}

// 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1: page + 1}>
    <span>Page ${type === 'prev' ? page - 1: page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 & pages > 1) {
        // Only button to go to the next page
        button = createButton(page, 'next');
    } else if (page < pages ) {

        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to previous page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML("afterbegin", button);
}

export const renderResults = (recipes, page = 1, resPerPage = 9) => {
    // Render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    //console.log(recipes)
    recipes.slice(start, end).forEach(renderRecipe);

    // Render pagination button
    renderButtons(page, recipes.length, resPerPage);
}