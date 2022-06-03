import createElement from '../../assets/lib/create-element.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = this.render();
  }

  render() {
    const productGrid = document.createElement('DIV');
    productGrid.classList.add('products-grid');
    const productGridInner = document.createElement('DIV');
    productGridInner.classList.add('products-grid__inner');
    for (let product of this.products) {
      productGridInner.append(this.createProductCard(product));
    }
    productGrid.append(productGridInner);
    return productGrid;
  }

  createProductCard(product) {
    let card = `<div class="card">
    <div class="card__top">
        <img src="/assets/images/products/${product.image}" class="card__image" alt="product">
        <span class="card__price">€${product.price.toFixed(2)}</span>
    </div>
    <div class="card__body">
        <div class="card__title">${product.name}</div>
        <button type="button" class="card__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
    </div>
</div>`;
    return createElement(card);
  }

  updateFilter(filters) {
    for (let value in filters) {
      if (filters.hasOwnProperty(value)) {
        this.filters[value] = filters[value];
      }
    }

    let grid = document.querySelector('.products-grid__inner');
    grid.innerHTML = "";
    for (let product of this.products) {
      if (this.filters.noNuts && product.nuts) {
        continue;
      }
      if (this.filters.vegeterianOnly && !product.vegeterian) {
        continue;
      }
      if (void 0 !== this.filters.maxSpiciness && product.spiciness > this.filters.maxSpiciness) {
        continue;
      }
      if (this.filters.category && product.category !== this.filters.category) {
        continue;
      }
      grid.append(this.createProductCard(product));
    }
  }

}
