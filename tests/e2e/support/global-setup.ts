import { removeTestBookings } from "./cleanup";

export default async function globalSetup() {
  const left = await removeTestBookings();
  if (left.reservations || left.gursha) {
    console.log(`Removed bookings left by an earlier run: ${JSON.stringify(left)}`);
  }
}
