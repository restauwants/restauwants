import { Button } from "@restauwants/ui/button";

import { signInDiscord, signInGoogle } from "../../actions";

export default async function SignIn() {
  return (
    <>
      <p>Please sign in to continue</p>
      <form>
        <Button size="sm" formAction={signInDiscord}>
          Sign in with Discord
        </Button>
      </form>
      <form>
        <Button size="sm" formAction={signInGoogle}>
          Sign in with Google
        </Button>
      </form>
    </>
  );
}
