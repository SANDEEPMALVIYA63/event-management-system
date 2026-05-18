export async function bookingExpired(booking: any) {
  const isExpired =
    !booking.holdExpiresAt || booking.holdExpiresAt < new Date();

  return isExpired;
}
