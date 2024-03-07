import { redirect } from "next/navigation";

import { feedPage as feedPagePath } from "~/app/paths";

export default async function Home() {
  redirect(feedPagePath);
}
