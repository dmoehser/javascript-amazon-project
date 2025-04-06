import { products } from "./products.js";

// Load cart from localStorage or initialize as empty array
export let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('Initial cart:', cart); // Debug log

export function addToCart(productId, quantity) {
  let matchingItem;

  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

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

  saveCart();
}

export function removeFromCart(productId) {
  const newCart = cart.filter(item => item.productId !== productId);
  cart.length = 0;
  cart.push(...newCart);
  
  saveCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartQuantity();
}

export function updateCartQuantity() {
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) { 
    const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartQuantityElement.innerHTML = cartQuantity === 0 ? '' : cartQuantity;
  }
}