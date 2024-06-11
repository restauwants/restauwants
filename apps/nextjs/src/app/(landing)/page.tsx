"use client";

import { Auth, AuthProgressContextProvider } from "./auth";
import { CallToAction } from "./call-to-action";
import { ExamplesBackground } from "./examples-background";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import { ReviewExamples } from "./review-examples";
import { ReviewFormExample } from "./review-form-example";

export default function LandingPage() {
  // TODO(99): pass initial state from server component and remove disabled state in buttons
  return (
    <AuthProgressContextProvider>
      <div className="flex flex-col">
        <Auth />
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
}
