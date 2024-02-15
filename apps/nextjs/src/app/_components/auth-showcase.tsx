import { auth, signIn, signOut } from "@restauwants/auth";
import { Button } from "@restauwants/ui/button";

export async function AuthShowcase() {
  const session = await auth();

  if (!session) {
    return (
      <form>
        <Button
          size="lg"
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

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signOut();
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
