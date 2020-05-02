import { elements } from './base';

export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                 <svg>
                     <use href="img/icons.svg#icon-circle-with-cross"></use>
                 </svg>
             </button>
        </li>
    `;
    // <div class="shopping__count">
    //             <input type="number" value="500" step="100">
    //             <p>g</p>
    //         </div>
    //         
    elements.shopping.insertAdjacentHTML('beforeend', markup);
}

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"`);
    item.parentElement.removeChild(item);
}