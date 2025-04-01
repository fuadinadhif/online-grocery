import { auth } from "@/auth";
import Link from "next/link";

import SignOutForm from "./sign-out-form";

export default async function Header() {
  const session = await auth();

  return (
    <header className="max-wrapper flex h-24 items-center justify-between">
      <div>
        <Link href={"/"}>Logo</Link>
      </div>
      <div>
        {session && session.user ? (
          <div className="flex gap-4">
            <p>{session.user.name}</p>
            <SignOutForm />
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href={"/auth/customer/sign-in"}>Sign In</Link>
            <Link href={"/auth/customer/register"}>Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}
