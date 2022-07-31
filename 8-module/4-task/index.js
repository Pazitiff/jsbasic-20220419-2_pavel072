import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (product === null || product === undefined) {
      return;
    }

    let cartItem = this.cartItems.find(function (item, index, array) {
      return item.product.id === product.id;
    });

    if (cartItem !== undefined) {
      cartItem.count++;
    } else {
      cartItem = {
        product,
        'count': 1
      };
      this.cartItems.push(cartItem);
    }

    // cartItem - обновлённый/новосозданный элемент cartItems
    this.onProductUpdate(cartItem);
  }


  plusProduct(prodVal) {
    if (prodVal === null || prodVal === undefined) {
      return;
    }

    let cartItem = this.cartItems.find(function (item, index, array) {
      return item.product.id === prodVal.product.id;
    });

    if (cartItem !== undefined) {
      cartItem.count++;
    }

    this.onProductUpdate(cartItem);
  }

  minusProduct(prodVal) {
    if (prodVal === null || prodVal === undefined) {
      return;
    }

    let cartItem = this.cartItems.find(function (item, index, array) {
      return item.product.id === prodVal.product.id;
    });

    if (cartItem !== undefined) {
      cartItem.count--;
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItem = this.cartItems.find(function (item, index, array) {
      return item.product.id === productId;
    });

    if (cartItem !== undefined && cartItem.count > 0) {
      if (amount > 0) {
        cartItem.count++;
      }

      if (amount < 0) {
        cartItem.count--;
      }

      if (cartItem.count === 0) {
        this.cartItems = this.cartItems.filter(function (item) {
          return item.product.id !== productId;
        });
      }

      this.onProductUpdate(cartItem);
    }
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    let totalCount = 0;
    for (let cartItem of this.cartItems) {
      if (cartItem.hasOwnProperty('count')) {
        totalCount += +cartItem.count;
      }
    }
    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;
    for (let cartItem of this.cartItems) {
      totalPrice += cartItem.product.price * +cartItem.count;
    }
    return totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
      2
    )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    let modal = new Modal();
    modal.setTitle('Your order');
    let product;
    let body = createElement('<div></div>');
    for (let cartItem of this.cartItems) {
      product = this.renderProduct(cartItem.product, cartItem.count);

      product.addEventListener('click', (event) => {

        let buttonPlus = event.target.closest('.cart-counter__button_plus');
        if (!buttonPlus) {
          return;
        }

        let addProductId = event.currentTarget.dataset.productId;
        let productToAdd = this.cartItems.find((item) => item.product.id === addProductId);

        if (productToAdd) {
          this.plusProduct(productToAdd);
        }
      });

      product.addEventListener('click', (event) => {

        let buttonMinus = event.target.closest('.cart-counter__button_minus');
        if (!buttonMinus) {
          return;
        }

        let delProduct = event.currentTarget.dataset.productId;
        let productToDelete = this.cartItems.find((item) => item.product.id === delProduct);

        if (productToDelete) {
          this.minusProduct(productToDelete);
        }
      });

      body.append(product);
    }

    body.append(this.renderOrderForm());

    modal.setBody(body);
    modal.open();

    document.body.append(modal);
    document.body.classList.add('is-modal-open');

  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
    // Начал делать
    if (document.body.classList.contains('is-modal-open')) {
      let productId = cartItem.product.id; // Уникальный идентификатора товара (для примера)
      // let modalBody = корневой элемент тела модального окна, который мы получили, вызвав метод renderModal
      let modalBody = document.body.querySelector('.modal__body');
// Элемент, который хранит количество товаров с таким productId в корзине
      let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
// Элемент с общей стоимостью всех единиц этого товара
      let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
// Элемент с суммарной стоимостью всех товаров
      let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

      productCount.innerHTML = cartItem.count;

      // productPrice.innerHTML = `€${новая стоимость товаров такого вида с округлением до 2го знака после запятой}`;
      let num = cartItem.count * cartItem.product.price;
      let newSum = num.toFixed(2);
      productPrice.innerHTML = `€${newSum}`;

      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
      console.log(cartItem);

    }
  }

  onSubmit(event) {
    // ...ваш код
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

