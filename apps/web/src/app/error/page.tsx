"use client";

import { useSearchParams } from "next/navigation";

enum Error {
  Configuration = "Configuration",
  AccessDenied = "AccessDenied",
  Verification = "Verification",
  Default = "Default",
}

const errorMap = {
  [Error.Configuration]:
    "There was a problem with the server configuration. Check your options and try again. If this error persists, please contact support.",
  [Error.AccessDenied]:
    "Access denied. You may not have permission to sign in. If you believe this is a mistake, please contact support.",
  [Error.Verification]:
    "Your email verification token has expired or has already been used. Please request a new verification email.",
  [Error.Default]:
    "An unknown error occurred. Please try again later. If the issue persists, contact support.",
};

export default function AuthErrorPage() {
  const search = useSearchParams();
  const error = search.get("error") as Error;
  const message = search.get("message");

  return (
    <main className="max-wrapper flex flex-1 flex-col items-center justify-center">
      {message && <p className="mb-5">{message}</p>}
      <p className="w-full max-w-96 border-1 p-2 text-center">
        {errorMap[error] || errorMap[Error.Default]}
      </p>
    </main>
  );
}
