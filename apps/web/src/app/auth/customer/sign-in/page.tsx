"use client";

import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { LoginSchema } from "schemas";
import GoogleSignInForm from "@/components/google-sign-in-form";
import { notify } from "@/utils/toastify";
import { useForm } from "@/hooks/use-form";
import GeneralInput from "@/components/general-input";
import PasswordInput from "@/components/password-input";
import { fetchJsonApi } from "@/utils/fetch-json-api";

export default function SignInPage() {
  const {
    formData,
    errors,
    isLoading,
    touched,
    setFormData,
    setErrors,
    setIsLoading,
    setTouched,
    handleChange,
    handleBlur,
  } = useForm(LoginSchema, {
    email: "",
    password: "",
  });
  const router = useRouter();
  const { update: updateSession } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();

      setIsLoading(true);
      setTouched({ email: true, password: true });

      const parsedFormData = LoginSchema.parse(formData);

      const loginData = await fetchJsonApi({
        url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/sign-in`,
        method: "POST",
        body: parsedFormData,
        credentials: true,
        errorMessage: "Failed to login",
      });

      notify(loginData.message);
      setFormData({ email: "", password: "" });
      setErrors({});

      await updateSession();
      router.push("/");
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.flatten().fieldErrors;
        setErrors(errors);
      } else if (error instanceof Error) {
        setErrors((prev) => ({
          ...prev,
          form: [error.message || "An unexpected error occurred"],
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="max-wrapper flex flex-1 flex-col items-center justify-center">
      {errors.form && (
        <p className="mb-5 w-full max-w-96 bg-red-300 py-2 text-center">
          {errors.form}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid w-full max-w-96 gap-4">
        <GeneralInput
          label="Email"
          id="email"
          type="email"
          value={formData.email}
          errors={touched.email ? errors.email : undefined}
          handleBlur={() => handleBlur("email")}
          handleChange={(value) => handleChange("email", value)}
        />

        <PasswordInput
          label="Password"
          id="password"
          value={formData.password}
          errors={touched.password ? errors.password : undefined}
          handleBlur={() => handleBlur("password")}
          handleChange={(value) => handleChange("password", value)}
        />

        <button
          className={`${isLoading ? "bg-gray-300" : "bg-gray-700"} text-white`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
        <Link
          href="/auth/customer/password/forget"
          className="text-sm underline"
        >
          Forgot password?
        </Link>
      </form>

      <div className="my-10 flex w-full max-w-96 items-center gap-2">
        <div className="h-0 w-full border-b-[0.025rem] border-gray-700"></div>
        <span>Or</span>
        <div className="h-0 w-full border-b-[0.025rem] border-gray-700"></div>
      </div>

      <GoogleSignInForm className="w-full max-w-96 border border-gray-700 text-center" />
    </main>
  );
}
