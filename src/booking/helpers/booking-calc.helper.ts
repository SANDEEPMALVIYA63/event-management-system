export function calculateTotalPrice(quantity: number, ticketPrice: number) {
  return quantity * ticketPrice;
}

export function calculateHoldExpiry(holdMinutes: number) {
  return new Date(Date.now() + holdMinutes * 60 * 1000);
}
