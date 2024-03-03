import { auth } from "@restauwants/auth";
import { Button } from "@restauwants/ui/button";

import { login } from "../app/actions";

export async function LoginButton() {
  const session = await auth();

  if (session) {
    throw new Error("Already authenticated");
  }

  return (
    <form>
      <Button size="sm" formAction={login}>
        Sign in with Discord
      </Button>
    </form>
  );
}
