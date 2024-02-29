import { redirect } from "next/navigation";

import { auth } from "@restauwants/auth";

import { LoginButton } from "../_components/loginButton";

export default async function Login() {
  const session = await auth();
  if (session) {
    redirect("/profile");
  }
  return (
    <div className="bg-login-background flex min-h-screen min-w-full items-end justify-center bg-cover bg-bottom bg-no-repeat">
      <div className="flex w-full max-w-screen-sm flex-col items-center space-y-2 rounded-t-3xl bg-white px-8 pb-20 pt-8 text-center">
        <h1 className="text-5xl font-extrabold">RestauWants</h1>
        <p className="text-gray-500">Please login to continue</p>
        <LoginButton />
      </div>
    </div>
  );
}
