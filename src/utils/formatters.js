
/**
 * Formats a number as Indian Rupees
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol
 * @returns {string} Formatted currency string
 */
export const formatIndianRupees = (amount, showSymbol = true) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
};

/**
 * Format area in square feet
 * @param {number} area - Area in square feet
 * @returns {string} Formatted area
 */
export const formatArea = (area) => {
  return `${area} sq.ft.`;
};

/**
 * Creates a short address from a full address
 * @param {string} address - Full address
 * @returns {string} Shortened address
 */
export const shortenAddress = (address) => {
  // Split address by commas and take the last 2 parts
  const parts = address.split(',');
  if (parts.length <= 2) return address;
  
  return parts.slice(-2).join(',').trim();
};
