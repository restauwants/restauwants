import { Button } from "@restauwants/ui/button";

import { signIn } from "../../actions";

export default async function SignIn() {
  return (
    <>
      <p>Please sign in to continue</p>
      <form>
        <Button size="sm" formAction={signIn}>
          Sign in with Discord
        </Button>
      </form>
    </>
  );
}
