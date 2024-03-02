import { Button } from "@restauwants/ui/button";

export async function AddContactButton() {
  return (
    <form>
      <Button
        size="sm"
        formAction={async () => {
          "use server";
        }}
      >
        Add Contact
      </Button>
    </form>
  );
}
