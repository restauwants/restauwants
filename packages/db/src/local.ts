export const isLocal =
  process.env.DB_HOST &&
  ["localhost", "127.0.0.1"].includes(process.env.DB_HOST);
