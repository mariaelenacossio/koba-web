import { removeTestBookings } from "./cleanup";

export default async function globalTeardown() {
  const removed = await removeTestBookings();
  console.log(`Removed test bookings: ${JSON.stringify(removed)}`);
}
