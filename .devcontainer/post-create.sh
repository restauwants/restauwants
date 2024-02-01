# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
if [ ! -f .env ]; then
  cp .env.example .env
fi
