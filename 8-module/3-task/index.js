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

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче
    this.cartIcon.update(this);
  }
}

