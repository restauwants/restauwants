"use client";

import { api } from "~/trpc/react";

export default function Upload2() {
  const presignedUrl = api.photo.getSignedUrl.useQuery(3);
  return <p>{presignedUrl.data}</p>;
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
