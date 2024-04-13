+++
title = 'Getting started developing'
date = 2024-04-12T21:30:00Z
+++

### Getting Started
NOTE: These instructions assume you are using a Dev Container within Visual Studio code. This requires both Docker and Visual Studio Code to be installed. There are instructions online about how to use it. If you choose not to use a Dev Container, you'll need to install Node 20.11 yourself.

Once you've run the Dev Container (or you've setup Node yourself), then run the following from the root of the repo:
- `pnpm i` (if this fails, may need to install pnpm and try again)
- `cp .env.example .env`
- Edit the .env file to contain your dev secrets (listed below)

```
# The database URL is used to connect to your PlanetScale database.
DB_HOST=
DB_NAME='restauwants'
DB_USERNAME=
DB_PASSWORD=

# @see https://next-auth.js.org/configuration/options#nextauth_url
AUTH_URL='http://localhost:3000'
AUTH_REDIRECT_PROXY_URL="http://localhost:3001/api"

# You can generate the secret via 'openssl rand -base64 32' on Unix
# @see https://next-auth.js.org/configuration/options#secret
AUTH_SECRET=

# Preconfigured Discord OAuth provider, works out-of-the-box
# @see https://next-auth.js.org/providers/discord
AUTH_DISCORD_ID=
AUTH_DISCORD_SECRET=
```

- Run `pnpm run dev` in your terminal
- Visit [http://localhost:3000/](http://localhost:3000/) in your browser. You should see the app (with posts appearing, as expected)!