import { cart } from '../data/cart.js';
import { products } from '../data/products.js';

// Generiere den HTML-Code für die Produkte
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
            $${(totalPriceCents / 100).toFixed(2)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
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

// Add delete functionality
document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    
    // Remove item from cart
    const newCart = cart.filter(item => item.productId !== productId);
    cart.length = 0;
    cart.push(...newCart);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Remove the item from the page
    document.querySelector(`.js-cart-item-${productId}`).remove();
    
    // Update totals
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
    const shippingCost = 4.99;
    const totalBeforeTax = (totalPrice / 100) + shippingCost;
    const tax = totalBeforeTax * 0.1;
    const total = totalBeforeTax + tax;

    // Update all summary information
    document.querySelector('.checkout-header-middle-section').innerHTML = 
      `Checkout (<a class="return-to-home-link" href="amazon.html">${totalItems} items</a>)`;

    document.querySelector('.payment-summary-row:nth-child(1)').innerHTML = 
      `<div>Items (${totalItems}):</div>
       <div class="payment-summary-money">$${(totalPrice / 100).toFixed(2)}</div>`;

    document.querySelector('.payment-summary-row:nth-child(2) .payment-summary-money').innerHTML = 
      `$${shippingCost.toFixed(2)}`;

    document.querySelector('.subtotal-row .payment-summary-money').innerHTML = 
      `$${totalBeforeTax.toFixed(2)}`;

    document.querySelector('.payment-summary-row:nth-child(4) .payment-summary-money').innerHTML = 
      `$${tax.toFixed(2)}`;

    document.querySelector('.total-row .payment-summary-money').innerHTML = 
      `$${total.toFixed(2)}`;
  });
});

// Calculate totals
const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
const totalPrice = cart.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
const shippingCost = 4.99;
const totalBeforeTax = (totalPrice / 100) + shippingCost;
const tax = totalBeforeTax * 0.1;
const total = totalBeforeTax + tax;

// Update payment summary
const headerSection = document.querySelector('.checkout-header-middle-section');
if (headerSection) {
  headerSection.innerHTML = `Checkout (<a class="return-to-home-link" href="amazon.html">${totalItems} items</a>)`;
}

const paymentSummary = document.querySelector('.payment-summary');
if (paymentSummary) {
  const rows = paymentSummary.querySelectorAll('.payment-summary-row');
  if (rows.length > 0) {
    // Update items count and price
    rows[0].innerHTML = `
      <div>Items (${totalItems}):</div>
      <div class="payment-summary-money">$${(totalPrice / 100).toFixed(2)}</div>
    `;

    // Update shipping cost
    const shippingElement = rows[1].querySelector('.payment-summary-money');
    if (shippingElement) {
      shippingElement.innerHTML = `$${shippingCost.toFixed(2)}`;
    }

    // Update subtotal
    const subtotalElement = document.querySelector('.subtotal-row .payment-summary-money');
    if (subtotalElement) {
      subtotalElement.innerHTML = `$${totalBeforeTax.toFixed(2)}`;
    }

    // Update tax
    const taxElement = rows[3].querySelector('.payment-summary-money');
    if (taxElement) {
      taxElement.innerHTML = `$${tax.toFixed(2)}`;
    }

    // Update total
    const totalElement = document.querySelector('.total-row .payment-summary-money');
    if (totalElement) {
      totalElement.innerHTML = `$${total.toFixed(2)}`;
    }
  }
}