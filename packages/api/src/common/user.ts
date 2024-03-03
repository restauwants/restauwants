import type { Database } from "@restauwants/db";
import { eq, schema } from "@restauwants/db";

export const usernameToId = async (
  username: string,
  db: Database,
): Promise<string> => {
  const result = await db.query.userData.findFirst({
    where: eq(schema.userData.username, username),
  });
  if (!result) {
    throw new Error("User not found");
  }
  return result.id;
};
