import { elements } from "./base";

export const renderItem = (item) => {
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
  elements.shopping.insertAdjacentHTML("beforeend", markup);
};

export const deleteItem = (id) => {
  const item = document.querySelector(`[data-itemid="${id}"`);
  item.parentElement.removeChild(item);
};
