import { withRestrictionsBasedOnSession } from "~/actions/navigation";
import { CreateReviewForm } from "../../../components/reviews";

export default withRestrictionsBasedOnSession(async () => {
  return (
    <div className="container min-h-dvh pb-20 pt-12">
      <CreateReviewForm />
    </div>
  );
});
