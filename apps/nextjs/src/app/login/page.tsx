import { redirect } from "next/navigation";

import { auth } from "@restauwants/auth";

import { AuthShowcase } from "../_components/auth-showcase";

const baseURL = process.env.AUTH_URL;

export default async function Login() {
  const session = await auth();
  if (session) {
    redirect("/profile");
  }
  return (
    <div
      className="container min-h-screen py-8"
      style={{
        backgroundImage: `url('/vecteezy_crab-stick-salad_2164000.jpg')`,
        backgroundSize: "cover", // Ensure the image covers the entire container
        backgroundRepeat: "no-repeat", // Prevent the image from repeating
        backgroundPosition: "center", // Center the background image
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-secondary object-top p-[20%] pb-24 pt-[6%] md:left-1/2 md:-translate-x-1/2 md:transform">
        <div className="flex w-[100%] flex-col items-center justify-center">
          <span className="text pb-4 text-center text-sm md:w-[100%]">
            Welcome back to
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text p-4">RestauWants</span>
          </h1>
          <div className="pt-[16%]">
            <AuthShowcase />
          </div>
        </div>
      </div>
    </div>
  );
}
