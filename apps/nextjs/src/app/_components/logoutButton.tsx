import { auth, signOut } from "@restauwants/auth";
import { Button } from "@restauwants/ui/button";

export async function LogoutButton() {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  return (
    <form>
      <Button
        size="md"
        variant="transparent"
        formAction={async () => {
          "use server";
          await signOut();
        }}
      >
        Log Out
      </Button>
    </form>
  );
}
