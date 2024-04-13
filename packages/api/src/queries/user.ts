import type { Database } from "@restauwants/db";
import { eq, schema } from "@restauwants/db";

export const usernameToId = async (
  db: Database,
  username: string,
): Promise<string | null> => {
  const profile = await db.query.profile.findFirst({
    where: eq(schema.profile.username, username),
  });
  return profile?.id ?? null;
};
