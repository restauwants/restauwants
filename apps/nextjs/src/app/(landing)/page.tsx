import { withRestrictionsBasedOnSession } from "~/actions/navigation";
import { api } from "~/trpc/server";
import { Auth, AuthProgressContextProvider } from "./auth";
import { CallToAction } from "./call-to-action";
import { ExamplesBackground } from "./examples-background";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import { ReviewExamples } from "./review-examples";
import { ReviewFormExample } from "./review-form-example";

export default withRestrictionsBasedOnSession(() => {
  const user = api.user.currentWithOptionals().catch((e) => void e);
  return (
    <AuthProgressContextProvider>
      <div className="flex flex-col">
        <Auth user={user} />
        <Header />
        <Hero />
        <ExamplesBackground>
          <ReviewFormExample />
          <ReviewExamples />
        </ExamplesBackground>
        <CallToAction />
        <Footer />
      </div>
    </AuthProgressContextProvider>
  );
});
