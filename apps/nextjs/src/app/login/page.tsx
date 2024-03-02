import { LoginButton } from "../../components/loginButton";

export default async function Login() {
  return (
    <div className="flex min-h-dvh min-w-full items-center justify-center">
      <div className="bg-login-background absolute -z-50 h-full w-full max-w-screen-sm bg-cover bg-bottom bg-no-repeat sm:rounded-3xl" />
      <div className="flex flex-col items-center space-y-2 rounded-3xl border-2 bg-background p-8 text-center shadow-2xl">
        <h1 className="text-5xl font-extrabold">RestauWants</h1>
        <p>Please login to continue</p>
        <LoginButton />
      </div>
    </div>
  );
}
