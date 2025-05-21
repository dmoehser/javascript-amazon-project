import { formatCurrency } from '../scripts/utilis/money.js';

describe('formatCurrency', () => {
  test('formatiert 2095 Cents korrekt zu 20.95', () => {
    expect(formatCurrency(2095)).toBe('20.95');
  });

  test('formatiert 0 Cents korrekt zu 0.00', () => {
    expect(formatCurrency(0)).toBe('0.00');
  });

  test('formatiert 1000 Cents korrekt zu 10.00', () => {
    expect(formatCurrency(1000)).toBe('10.00');
  });

  test('formatiert 9999 Cents korrekt zu 99.99', () => {
    expect(formatCurrency(9999)).toBe('99.99');
  });

  test('rundet 2095.5 Cents korrekt zu 20.96', () => {
    expect(formatCurrency(2095.5)).toBe('20.96');
  });

  test('rundet 2000.5 Cents korrekt zu 20.01', () => {
    expect(formatCurrency(2000.5)).toBe('20.01');
  });

  test('rundet 2000.4 Cents korrekt zu 20.00', () => {
    expect(formatCurrency(2000.4)).toBe('20.00');
  });

});
