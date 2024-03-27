"use client"

export default async function Upload2() {
    const res = await fetch(getBaseUrl() + `/api/upload?file=lmao`);

    const { presignedUrl } = (await res.json()) as { presignedUrl: string };

    return <p>{presignedUrl}</p>
}

function getBaseUrl() {
    if (typeof window !== "undefined") return window.location.origin;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
  }