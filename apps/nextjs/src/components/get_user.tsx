import { auth } from "@restauwants/auth";

export async function getUserID() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const id: string = session.user.id;
  return id;
}
