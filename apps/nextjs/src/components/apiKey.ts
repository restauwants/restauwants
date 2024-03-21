"use server";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

export async function PassKey() {
  return GOOGLE_KEY;
}
