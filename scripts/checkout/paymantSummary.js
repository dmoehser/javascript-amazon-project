import { cart, calculateCartQuantity } from '../../data/cart.js';
import { deliveryOptions } from '../../scripts/deliveryOptions.js';
import { formatCurrency } from '../../scripts/utilis/money.js';

export function renderPaymantSummary() {
  const totalItems = calculateCartQuantity();
  const totalPrice = cart.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  
  // Calculate shipping costs
  const uniqueProductIds = new Set();
  const shippingCost = cart.reduce((sum, item) => {
    if (uniqueProductIds.has(item.product.id)) {
      return sum;
    }
    uniqueProductIds.add(item.product.id);
    const deliveryOption = deliveryOptions.find(option => option.id === item.deliveryOptionId);
    return sum + (deliveryOption ? deliveryOption.priceCents : 0);
  }, 0);
  
  const totalBeforeTax = (totalPrice / 100) + (shippingCost / 100);
  const tax = totalBeforeTax * 0.1;
  const total = totalBeforeTax + tax;

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


 