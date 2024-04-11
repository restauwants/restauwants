import { withRestrictionsBasedOnSession } from "~/actions/navigation";
import { CreateProfileModal } from "./modal";

export default withRestrictionsBasedOnSession(() => <CreateProfileModal />);
