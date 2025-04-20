"use client";

import Link from "next/link";

import SignOutForm from "./sign-out-form";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

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
