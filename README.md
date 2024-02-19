# RestauWants

## About

Track, review, wishlist, and share restaurants with friends.

## Links

- [Documentation](https://restauwants.github.io/restauwants/)
- [Application](https://restauwants-nextjs.vercel.app/)

## Project Structure

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
        └─ Deployment of Hugo documentation
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ auth-proxy
  |   ├─ Nitro server to proxy OAuth requests in preview deployments
  |   └─ Uses Auth.js Core
  └─ next.js
      ├─ Next.js 14
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v11 router definition
  ├─ auth
  |   └─ Authentication using next-auth.
  ├─ db
  |   └─ Typesafe db calls using Drizzle & Planetscale
  └─ ui
      └─ Start of a UI package for the webapp using shadcn-ui
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

## Quick Start

To get it running, follow the steps below:

### 1. Use the DevContainer

This project is set up to use the [VSCode DevContainer](https://code.visualstudio.com/docs/remote/containers) for development. If you have the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension installed, you can open the project in a container by clicking the green "Open in Container" button in the bottom right corner of the window.

### 2. Setup the environment variables

Create a `.env` file in the root of the project by copying the `.env.example` file and filling in the required environment variables. Similarly, inside of [`apps/auth-proxy`](./apps/auth-proxy), create a `.env` file by copying the `.env.example` file and filling in the required environment variables.

```bash
cp .env.example .env
cp apps/auth-proxy/.env.example apps/auth-proxy/.env
```

### 3. Run the project locally

To run the project locally, run the following in the root of the project:

```bash
pnpm run dev
docker compose up
```

The Next.js application will be available on [http://localhost:3000](http://localhost:3000). The docker-compose command will start the MySQL database, Adminer, and PlanetScale API proxy. The Adminer interface will be available on [http://localhost:8080](http://localhost:8080).

### 4. When it's time to add a new package

To add a new package, simply run `pnpm turbo gen init` in the monorepo root. This will prompt you for a package name as well as if you want to install any dependencies to the new package (of course you can also do this yourself later).

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around your package such as formatting, linting and typechecking. When the package is created, you're ready to go build out the package.

## Deployment

Both the Next.js server and the auth proxy are deployed using Vercel. The Next.js server is the main application. The auth proxy is a Nitro server that proxies OAuth requests in preview deployments. This is required for the Next.js app to be able to authenticate users in preview deployments. The auth proxy is not used for OAuth requests in production deployments.

## Documentation

Hugo is used to generate the documentation for the project. The documentation is hosted on GitHub Pages. To run the documentation locally, run the following in the root of the project:

```bash
hugo serve --source ./docs
```

## Team

- [Callum Curtis](https://github.com/callumcurtis)
- [Norman Anderson](https://github.com/anormananderson)
- [Devin Frioud](https://github.com/DevinFrioud)
- [Nicklaus Badyal](https://github.com/Nebula5102)
- [Rebecca Jeon](https://github.com/rebecca-jeon)

## References

The project originates from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).
