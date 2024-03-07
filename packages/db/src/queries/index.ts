import type { Database } from "..";
import { eq, schema } from "..";

export const usernameToId = async (
  db: Database,
  username: string,
): Promise<string | null> => {
  const profile = await db.query.profile.findFirst({
    where: eq(schema.profile.username, username),
  });
  return profile?.id ?? null;
};
