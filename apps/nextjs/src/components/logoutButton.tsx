import { auth } from "@restauwants/auth";
import { Button } from "@restauwants/ui/button";

import { logout } from "../app/actions";

export async function LogoutButton() {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  return (
    <form>
      <Button size="sm" formAction={logout}>
        Sign Out
      </Button>
    </form>
  );
}
