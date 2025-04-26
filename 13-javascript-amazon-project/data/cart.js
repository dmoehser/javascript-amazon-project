import { products } from "./products.js";

// Load cart from localStorage or initialize as empty array
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function calculateCartQuantity() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function updateCartQuantity() {
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) { 
    const cartQuantity = calculateCartQuantity();
    cartQuantityElement.innerHTML = cartQuantity === 0 ? '' : cartQuantity;
  }
}

export function addToCart(productId, quantity, deliveryOptionId = '1') {
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
      deliveryOptionId: deliveryOptionId,
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

export function updateDeliveryOption(productId, deliveryOptionId) {
  const cartItem = cart.find(item => item.productId === productId);
  if (cartItem) {
    cartItem.deliveryOptionId = deliveryOptionId;
    delete cartItem.deliveryOptionsId;
    saveCart();
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartQuantity();
}