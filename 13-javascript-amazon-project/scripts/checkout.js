import { cart, removeFromCart, calculateCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utilis/money.js';

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  const itemText = cartQuantity === 1 ? 'item' : 'items';
  document.querySelector('.js-cart-quantity').innerHTML = `${cartQuantity} ${itemText}`;
}

updateCartQuantity();

// Generate the HTML code for the products
let cartHTML = '';

cart.forEach((cartItem) => {
  const product = cartItem.product;
  const totalPriceCents = product.priceCents * cartItem.quantity; // Calculate total
  
  cartHTML += `
    <div class="cart-item-container js-cart-item-${product.id}">
      <div class="delivery-date">
        Delivery date: Wednesday, June 15
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
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input"
              name="delivery-option-${product.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" checked class="delivery-option-input"
              name="delivery-option-${product.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input"
              name="delivery-option-${product.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

// Update the order summary content
document.querySelector('.js-order-summary').innerHTML = cartHTML;

function updateCheckoutTotals() {
  const totalItems = calculateCartQuantity();
  const totalPrice = cart.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  const shippingCost = 4.99;
  const totalBeforeTax = (totalPrice / 100) + shippingCost;
  const tax = totalBeforeTax * 0.1;
  const total = totalBeforeTax + tax;

  // Update checkout header with current item count
  const headerSection = document.querySelector('.checkout-header-middle-section');
  if (headerSection) {
    const itemText = totalItems === 1 ? 'item' : 'items';
    headerSection.innerHTML = `Checkout (<a class="return-to-home-link js-cart-quantity" href="amazon.html">${totalItems} ${itemText}</a>)`;
  }

  const itemsRow = document.querySelector('.payment-summary-row:nth-child(1)');
  if (itemsRow) {
    itemsRow.innerHTML = `
      <div>Items (${totalItems}):</div>
      <div class="payment-summary-money">$${formatCurrency(totalPrice)}</div>
    `;
  }

  const shippingElement = document.querySelector('.payment-summary-row:nth-child(2) .payment-summary-money');
  if (shippingElement) {
    shippingElement.innerHTML = `$${formatCurrency(shippingCost * 100)}`;
  }

  const subtotalElement = document.querySelector('.subtotal-row .payment-summary-money');
  if (subtotalElement) {
    subtotalElement.innerHTML = `$${formatCurrency(totalBeforeTax * 100)}`;
  }

  const taxElement = document.querySelector('.payment-summary-row:nth-child(4) .payment-summary-money');
  if (taxElement) {
    taxElement.innerHTML = `$${formatCurrency(tax * 100)}`;
  }

  const totalElement = document.querySelector('.total-row .payment-summary-money');
  if (totalElement) {
    totalElement.innerHTML = `$${formatCurrency(total * 100)}`;
  }
}

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    document.querySelector(`.js-cart-item-${productId}`).remove();
    updateCheckoutTotals();
    updateCartQuantity();
  });
});

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

// Initial update of checkout totals
updateCheckoutTotals();