import { WavyBackground } from "@restauwants/ui/backgrounds";

import { withRestrictionsBasedOnSession } from "~/actions/navigation";
import { CreateReviewForm } from "../../../components/reviews";

export default withRestrictionsBasedOnSession(async () => {
  return (
    <>
      <WavyBackground variant={2} className="absolute -z-50 h-28 w-full" />
      <div className="container max-w-[48rem] pb-20 pt-24">
        <CreateReviewForm />
      </div>
    </>
  );
});
