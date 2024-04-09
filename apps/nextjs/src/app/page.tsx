import { redirect } from "next/navigation";

import { feedPage as feedPagePath } from "~/app/paths";
import { withRestrictionsBasedOnSession } from "../actions/navigation";

export default withRestrictionsBasedOnSession(() => redirect(feedPagePath));
