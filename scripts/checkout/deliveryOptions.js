import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export const deliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0
  },
  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
  },
  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }
];

export function getDeliveryOption(deliveryOptionId) {
  return deliveryOptions.find(option => option.id === deliveryOptionId);
}

export function calculateDeliveryDate(deliveryOption) {
  let deliveryDate = dayjs();
  let daysToAdd = deliveryOption.deliveryDays;
  
  // Add the desired number of days
  while (daysToAdd > 0) {
    deliveryDate = deliveryDate.add(1, 'day');
    daysToAdd--;
  }
  
  // If the result falls on a weekend, skip to the next Monday
  while (deliveryDate.day() === 0 || deliveryDate.day() === 6) {
    deliveryDate = deliveryDate.add(1, 'day');
  }
  
  return deliveryDate.format('dddd, MMMM D');
}

function isWeekend(date) {
  const dayOfWeek = date.format('dddd');
  return dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
} 