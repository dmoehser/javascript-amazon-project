import { cart, removeFromCart, calculateCartQuantity, updateDeliveryOption } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { deliveryOptions } from '../../scripts/deliveryOptions.js';
import { calculateDeliveryDate } from './deliveryOptions.js';
import { formatCurrency } from '../utilis/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  const itemText = cartQuantity === 1 ? 'item' : 'items';
  document.querySelector('.js-cart-quantity').innerHTML = `${cartQuantity} ${itemText}`;
}

function renderOrder() {
  let cartHTML = '';

  cart.forEach((cartItem) => {
    const product = cartItem.product;
    const totalPriceCents = product.priceCents * cartItem.quantity;
    
    // Find the selected delivery option
    const selectedDeliveryOption = deliveryOptions.find(option => option.id === cartItem.deliveryOptionId);
    const deliveryDate = calculateDeliveryDate(selectedDeliveryOption);
    const formattedDeliveryDate = deliveryDate.format('dddd, MMMM D');
    
    cartHTML += `
      <div class="cart-item-container js-cart-item-${product.id}">
        <div class="delivery-date">
          Delivery date: ${formattedDeliveryDate}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${product.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-price">
              $${formatCurrency(totalPriceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <input type="number" class="quantity-input js-quantity-selector-${product.id}" 
                style="display: none;"
                min="1" max="999" value="${cartItem.quantity}">
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${product.id}">
                Update
              </span>
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${product.id}" style="display: none;">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${product.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${generateDeliveryOptionsHTML(product.id, cartItem.deliveryOptionId)}
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-order-summary').innerHTML = cartHTML;
  setupDeleteListeners();
}

// Initialize the page
updateCartQuantity();
renderOrder();
updateCheckoutTotals();
renderCheckoutHeader();

// Initialize delivery options for each cart item
cart.forEach((cartItem) => {
  if (cartItem.deliveryOptionsId) {
    delete cartItem.deliveryOptionsId;
  }
  
  if (!cartItem.deliveryOptionId) {
    cartItem.deliveryOptionId = '1'; // Default to first option
    updateDeliveryOption(cartItem.productId, '1');
  }
});

// Add event listeners for delivery options
document.querySelectorAll('.js-delivery-option').forEach((option) => {
  option.addEventListener('click', (event) => {
    // Prevent triggering the event twice if clicking the radio button
    if (event.target.type === 'radio') return;
    
    const productId = option.dataset.productId;
    const selectedOptionId = option.dataset.optionId;
    
    // Update the radio button
    const radioInput = option.querySelector('.delivery-option-input');
    radioInput.checked = true;
    
    // Update delivery option in cart
    updateDeliveryOption(productId, selectedOptionId);
    
    // Update the delivery date
    const selectedDeliveryOption = deliveryOptions.find(option => option.id === selectedOptionId);
    const deliveryDate = calculateDeliveryDate(selectedDeliveryOption);
    const formattedDeliveryDate = deliveryDate.format('dddd, MMMM D');
    
    const cartItemContainer = document.querySelector(`.js-cart-item-${productId}`);
    const deliveryDateElement = cartItemContainer.querySelector('.delivery-date');
    deliveryDateElement.textContent = `Delivery date: ${formattedDeliveryDate}`;
    
    updateCheckoutTotals();
  });
});

// Set up delete event listeners for all delete links
function setupDeleteListeners() {
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderOrder();
      updateCheckoutTotals();
      updateCartQuantity();
    });
  });
}

// Add event listeners for update links
document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    
    // Hide update link and quantity label, show save link and selector
    link.style.display = 'none';
    document.querySelector(`.js-save-link[data-product-id="${productId}"]`).style.display = 'inline';
    
    const container = link.closest('.product-quantity');
    const quantityLabel = container.querySelector('.quantity-label');
    const quantitySelector = container.querySelector(`.js-quantity-selector-${productId}`);
    
    // Set current quantity in selector
    quantitySelector.value = quantityLabel.textContent;
    
    quantityLabel.parentElement.style.display = 'none';
    quantitySelector.style.display = 'inline-block';
    
    // Focus the input field and select its content
    quantitySelector.focus();
    quantitySelector.select();
    
    // Add keyboard event listener
    quantitySelector.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        // Trigger click on the corresponding save link
        document.querySelector(`.js-save-link[data-product-id="${productId}"]`).click();
      }
    });
  });
});

// Add event listeners for save links
document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = link.closest('.product-quantity');
    const quantitySelector = container.querySelector(`.js-quantity-selector-${productId}`);
    
    // Get original quantity from cart
    const originalQuantity = cart.find(item => item.product.id === productId)?.quantity || 1;
    let newQuantity = Number(quantitySelector.value);
    
    // Validate the input
    if (isNaN(newQuantity) || newQuantity < 1 || quantitySelector.value.trim() === '') {
      newQuantity = originalQuantity;
    } else if (newQuantity > 999) {
      newQuantity = 999;
    }
    
    // Update cart data
    cart.forEach((item) => {
      if (item.product.id === productId) {
        item.quantity = newQuantity;
      }
    });
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update display
    const quantityLabel = container.querySelector('.quantity-label');
    quantityLabel.textContent = newQuantity;
    
    // Show/hide elements
    link.style.display = 'none';
    document.querySelector(`.js-update-link[data-product-id="${productId}"]`).style.display = 'inline';
    quantitySelector.style.display = 'none';
    quantityLabel.parentElement.style.display = 'inline';
    
    // Update totals and cart quantity
    updateCheckoutTotals();
    updateCartQuantity();
  });
});

function updateCheckoutTotals() {
  const totalItems = calculateCartQuantity();
  const totalPrice = cart.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  
  // Calculate shipping costs
  const uniqueProductIds = new Set();
  const shippingCost = cart.reduce((sum, item) => {
    // Skip if we've already calculated shipping for this product ID
    if (uniqueProductIds.has(item.product.id)) {
      return sum;
    }
    
    // Mark this product ID as processed
    uniqueProductIds.add(item.product.id);
    
    const deliveryOption = deliveryOptions.find(option => option.id === item.deliveryOptionId);
    return sum + (deliveryOption ? deliveryOption.priceCents : 0);
  }, 0);
  
  const totalBeforeTax = (totalPrice / 100) + (shippingCost / 100);
  const tax = totalBeforeTax * 0.1;
  const total = totalBeforeTax + tax;

  // Update checkout header with current item count
  renderCheckoutHeader();

  // Update items row
  const itemsRow = document.querySelector('.js-items-row');
  if (itemsRow) {
    itemsRow.innerHTML = `
      <div>Items (${totalItems}):</div>
      <div class="payment-summary-money">$${formatCurrency(totalPrice)}</div>
    `;
  }

  // Update shipping cost
  const shippingElement = document.querySelector('.js-shipping-cost');
  if (shippingElement) {
    shippingElement.textContent = `$${formatCurrency(shippingCost)}`;
  }

  // Update subtotal
  const subtotalElement = document.querySelector('.js-subtotal');
  if (subtotalElement) {
    subtotalElement.textContent = `$${formatCurrency(totalBeforeTax * 100)}`;
  }

  // Update tax
  const taxElement = document.querySelector('.js-tax');
  if (taxElement) {
    taxElement.textContent = `$${formatCurrency(tax * 100)}`;
  }

  // Update total
  const totalElement = document.querySelector('.js-total');
  if (totalElement) {
    totalElement.textContent = `$${formatCurrency(total * 100)}`;
  }
}

// Initialize totals
updateCheckoutTotals();

function generateDeliveryOptionsHTML(productId, selectedDeliveryOptionId) {
  let html = '';
  
  deliveryOptions.forEach((option) => {
    const deliveryDate = calculateDeliveryDate(option);
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = option.priceCents === 0 ? 'FREE' : `$${formatCurrency(option.priceCents)}`;
    
    html += `
      <div class="delivery-option js-delivery-option" data-product-id="${productId}" data-option-id="${option.id}">
        <input type="radio" 
          class="delivery-option-input"
          name="delivery-option-${productId}"
          value="${option.id}"
          ${option.id === selectedDeliveryOptionId ? 'checked' : ''}>
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  });
  
  return html;
}

