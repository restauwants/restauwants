// Importing env files here to validate on build
import "./src/env.js";
import "@restauwants/auth/env";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@restauwants/api",
    "@restauwants/auth",
    "@restauwants/db",
    "@restauwants/ui",
    "@restauwants/validators",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
