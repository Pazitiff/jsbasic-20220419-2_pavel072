export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
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

  updateProductCount(productId, amount) {
    // ваш код
  }

  isEmpty() {
    // ваш код
  }

  getTotalCount() {
    // ваш код
  }

  getTotalPrice() {
    // ваш код
  }

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}

