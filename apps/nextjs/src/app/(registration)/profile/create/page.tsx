import { Button } from "@restauwants/ui/button";

import { logout } from "../../../actions";

export default async function CreateProfile() {
  return (
    <form>
      <Button size="sm" formAction={logout}>
        Sign Out
      </Button>
    </form>
  );
}
