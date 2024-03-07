import { Button } from "@restauwants/ui/button";

import { login } from "../../actions";

export default async function Login() {
  return (
    <>
      <p>Please login to continue</p>
      <form>
        <Button size="sm" formAction={login}>
          Sign in with Discord
        </Button>
      </form>
    </>
  );
}
