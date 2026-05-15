/**
 * Format number as Indian Rupees
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency with + or - prefix
 */
export function formatSignedCurrency(amount, type) {
  const formatted = formatCurrency(Math.abs(amount));
  if (type === 'Income') return `+${formatted}`;
  if (type === 'Expense') return `-${formatted}`;
  return formatted;
}
