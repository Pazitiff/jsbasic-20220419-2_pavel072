import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.addEventListeners();
    this.modal = new Modal();
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

    this.onProductUpdate(cartItem);
  }

  updateProductItem(product, direction) {
    if (product === null || product === undefined) {
      return;
    }

    let cartItem = this.cartItems.find(function (item, index, array) {
      return item.product.id === product.product.id;
    });

    if (cartItem !== undefined) {
      if (direction === 'plus') {
        cartItem.count++;
      }

      if (direction === 'minus') {
        cartItem.count--;
      }

      if (cartItem.count === 0) {
        this.cartItems = this.cartItems.filter(function (item) {
          return item.product.id !== product.product.id;
        });
      }
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
    // let modal = new Modal();
    this.modal.setTitle('Your order');
    let productItem;
    let body = createElement('<div></div>');
    for (let cartItem of this.cartItems) {
      productItem = this.renderProduct(cartItem.product, cartItem.count);

      // @todo - перенести в отдельную функцию
      productItem.addEventListener('click', (event) => {
        let btn = event.target.closest('.cart-counter__button');
        let productId = event.currentTarget.dataset.productId;

        let product = this.cartItems.find((item) => item.product.id === productId);
        if (!product) {
          return;
        }

        if (btn.classList.contains('cart-counter__button_plus')) {
          this.updateProductItem(product, 'plus');
        }

        if (btn.classList.contains('cart-counter__button_minus')) {
          this.updateProductItem(product, 'minus');
        }
      });

      body.append(productItem);
    }

    body.append(this.renderOrderForm());

    this.modal.setBody(body);
    this.modal.open();

    document.body.append(this.modal);
    document.body.classList.add('is-modal-open');

    let submitBtn = document.body.querySelector('.btn-group__button');
    submitBtn.addEventListener('click', (event) => {
      this.onSubmit(event);
    });
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
    if (document.body.classList.contains('is-modal-open')) {
      let productId = cartItem.product.id;
      let modalBody = document.body.querySelector('.modal__body');
      let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);
      productCount.innerHTML = cartItem.count;
      let num = cartItem.count * cartItem.product.price;
      let newSum = num.toFixed(2);
      productPrice.innerHTML = `€${newSum}`;
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;


      let empty = this.isEmpty();
      if (empty) {
        this.modal.close();
      }
    }
  }

  onSubmit(event) {
    event.preventDefault();
    let selectors = document.body.querySelectorAll('button[type=submit]');
    if (selectors[0].classList.contains('cart-buttons__button')) {
      selectors[0].classList.add('is-loading');

      let submit = async (e) => {
        // e.preventDefault();

        let cartForm = document.querySelector('.cart-form');
        let formData = new FormData(cartForm);

        let response = await fetch('https://httpbin.org/post', {
          method: 'POST',
          body: formData
        });

        return await response.status === 200;
      };

      let result = submit();

      if (result) {
        this.modal.setTitle('Success!');
        this.cartItems = [];
        let body = createElement('<div class="modal__body-inner">\n' +
          '  <p>\n' +
          '    Order successful! Your order is being cooked :) <br>\n' +
          '    We’ll notify you about delivery time shortly.<br>\n' +
          '    <img src="/assets/images/delivery.gif">\n' +
          '  </p>\n' +
          '</div>');
        this.modal.setBody(body);
      }
    }
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

