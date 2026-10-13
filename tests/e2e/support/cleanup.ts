import { db, TEST_EMAIL_PATTERN } from "./db";

/**
 * Removes every booking made by an e2e run and gives Gursha seats back.
 * Runs before and after the suite, so a crashed run is cleaned up next time.
 */
export async function removeTestBookings(): Promise<{ reservations: number; gursha: number }> {
  const client = db();

  const { data: removed, error: resError } = await client
    .from("reservations")
    .delete()
    .like("email", TEST_EMAIL_PATTERN)
    .select("id");
  if (resError) throw new Error(`Couldn't remove test reservations: ${resError.message}`);

  const { data: gursha, error: findError } = await client
    .from("gursha_bookings")
    .select("id")
    .like("email", TEST_EMAIL_PATTERN);
  if (findError) throw new Error(`Couldn't find test Gursha bookings: ${findError.message}`);

  let released = 0;
  if (gursha.length > 0) {
    const { data, error } = await client.rpc("release_gursha_seats", {
      p_ids: gursha.map((g) => g.id),
    });
    if (error) throw new Error(`Couldn't release test Gursha seats: ${error.message}`);
    released = data as number;
  }

  return { reservations: removed.length, gursha: released };
}
