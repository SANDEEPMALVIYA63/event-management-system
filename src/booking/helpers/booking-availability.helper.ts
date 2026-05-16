export function calculateAvailableTickets(
  eventTicketsSold: number,
  totalHold: number,
  maxTickets: number,
) {
  const totalTickets = eventTicketsSold + totalHold;
  return maxTickets - totalTickets;
}
