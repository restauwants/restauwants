import { auth, signIn } from "@restauwants/auth";
import { Button } from "@restauwants/ui/button";

export async function LoginButton() {
  const session = await auth();

  if (session) {
    throw new Error("Already authenticated");
  }

  return (
    <form>
      <Button
        size="sm"
        formAction={async () => {
          "use server";
          await signIn("discord");
        }}
      >
        Sign in with Discord
      </Button>
    </form>
  );
}
