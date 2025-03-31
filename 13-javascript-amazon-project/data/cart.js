import { products } from "./products.js";

// Load cart from localStorage or initialize as empty array
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart(productId, quantity) {
  let matchingItem;

  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  // Find the product information
  const product = products.find(product => product.id === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity: quantity,
      product: product
    });
  }

  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update cart quantity display
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}