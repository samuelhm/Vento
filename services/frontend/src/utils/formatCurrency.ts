/**
 * Formats a numeric value as a currency string (EUR).
 * - Shows 2 decimal places only if there are cents (e.g., 39.2 -> 39,20 €).
 * - Shows no decimal places if the number is an integer (e.g., 112 -> 112 €).
 */
export const formatCurrency = (amount: string | number): string => {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return "0 €";
  }

  // Check if the number has a fractional part
  const hasDecimals = numericAmount % 1 !== 0;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};
