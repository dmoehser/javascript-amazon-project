import { cart, addToCart, updateCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utilis/money.js';

// Update cart quantity when page loads
updateCartQuantity();

let productsHtml = '';

products.forEach((product) => {
  productsHtml += `
  <div class="product-container">
    <div class="product-image-container">
      <img class="product-image"
        src="${product.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">
      ${product.name}
    </div>

    <div class="product-rating-container">
      <img class="product-rating-stars"
        src="images/ratings/rating-${product.rating.stars * 10}.png">
      <div class="product-rating-count link-primary">
        ${product.rating.count}
      </div>
    </div>

    <div class="product-price">
      $${(product.priceCents / 100).toFixed(2)}
    </div>

    <div class="product-quantity-container">
      <select class="js-quantity-selector-${product.id}">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>

    <div class="product-spacer"></div>

    <div class="added-to-cart js-added-to-cart">
      <img src="images/icons/checkmark.png">
      Added
    </div>

    <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
      Add to Cart
    </button>
  </div>
  `;
});

document.querySelector('.js-products-grid').innerHTML = productsHtml;

// Speichere die Timeouts für jeden Button
const addedMessageTimeouts = new Map();

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const { productId } = button.dataset;
    const quantitySelector = document.querySelector(
      `.js-quantity-selector-${productId}`
    );
    
    // Stelle sicher, dass die Menge als Zahl gelesen wird
    const quantity = parseInt(quantitySelector.value, 10);
    
    // Debug-Ausgabe
    console.log(`Adding ${quantity} items of product ${productId}`);
    
    addToCart(productId, quantity);

    const container = button.closest('.product-container');
    const addedMessage = container.querySelector('.js-added-to-cart');
    
    // Lösche den vorherigen Timeout für diesen Button
    if (addedMessageTimeouts.has(productId)) {
      clearTimeout(addedMessageTimeouts.get(productId));
    }

    addedMessage.style.opacity = '1';

    // Speichere den neuen Timeout
    const timeout = setTimeout(() => {
      addedMessage.style.opacity = '0';
    }, 2000);

    addedMessageTimeouts.set(productId, timeout);
  });
});