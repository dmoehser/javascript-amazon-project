import { cart, removeFromCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utilis/money.js';

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

function updateCheckoutTotals() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  const shippingCost = 4.99;
  const totalBeforeTax = (totalPrice / 100) + shippingCost;
  const tax = totalBeforeTax * 0.1;
  const total = totalBeforeTax + tax;

  // Update checkout header with current item count
  const headerSection = document.querySelector('.checkout-header-middle-section');
  if (headerSection) {
    headerSection.innerHTML = `Checkout (<a class="return-to-home-link" href="amazon.html">${totalItems} item${totalItems === 1 ? '' : 's'}</a>)`;
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
    
    // Remove the item from the page
    document.querySelector(`.js-cart-item-${productId}`).remove();
    
    // Update totals
    updateCheckoutTotals();
  });
});

// Initial update of checkout totals
updateCheckoutTotals();