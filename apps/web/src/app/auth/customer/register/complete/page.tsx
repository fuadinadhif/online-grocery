"use client";

import { useSearchParams } from "next/navigation";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

import { notify } from "@/utils/toastify";
import { useForm } from "@/hooks/use-form";
import { CompleteRegistrationSchema } from "schemas";
import PasswordInput from "@/components/password-input";
import GeneralInput from "@/components/general-input";
import { fetchJsonApi } from "@/utils/fetch-json-api";

function CompleteContent() {
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
  } = useForm(CompleteRegistrationSchema, {
    name: "",
    password: "",
    confirmPassword: "",
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tokenError, setTokenError] = useState<unknown>();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const token = searchParams.get("token");

  useEffect(() => {
    async function validateToken() {
      setIsPageLoading(true);

      try {
        await fetchJsonApi({
          url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/token/validate?token=${token}`,
          errorMessage: "Failed to validate token",
        });
      } catch (error) {
        setTokenError(error);
      } finally {
        setIsPageLoading(false);
      }
    }

    validateToken();
  }, [searchParams, token]);

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();

      setIsLoading(true);
      setTouched({
        name: true,
        password: true,
        confirmPassword: true,
      });

      const parsedFormData = CompleteRegistrationSchema.parse(formData);

      const completeRegistrationData = await fetchJsonApi({
        url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/register/complete?token=${token}`,
        method: "PUT",
        body: parsedFormData,
        errorMessage: "Failed to complete registration",
      });

      notify(completeRegistrationData.message);
      setFormData({ name: "", password: "", confirmPassword: "" });
      setErrors({});
      router.push("/auth/customer/sign-in");
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.flatten().fieldErrors;
        setErrors(errors);
      } else if (error instanceof Error) {
        setErrors({ form: [error.message || "An unexpected error occured"] });
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isPageLoading) {
    return (
      <main className="max-wrapper flex flex-1 flex-col items-center justify-center p-4 text-center">
        <p>Validating your token...</p>
      </main>
    );
  }

  if (tokenError) {
    return (
      <main className="max-wrapper flex flex-1 flex-col items-center justify-center p-4 text-center">
        <p className="grid text-lg">
          Your registration request has expired. Please sign up again to
          continue
        </p>
        <Link
          href="/auth/customer/register"
          className="mt-5 bg-gray-700 px-6 py-2 text-white"
        >
          Sign up again
        </Link>
      </main>
    );
  }

  return (
    <main className="max-wrapper flex flex-1 flex-col items-center justify-center">
      {errors.form && (
        <p className="mb-5 w-full max-w-96 bg-red-300 py-2 text-center">
          {errors.form}
        </p>
      )}

      <form className="grid w-full max-w-96 gap-4" onSubmit={handleSubmit}>
        <GeneralInput
          label="Name"
          id="name"
          type="text"
          value={formData.name}
          errors={touched.name ? errors.name : undefined}
          handleBlur={() => handleBlur("name")}
          handleChange={(value) => handleChange("name", value)}
        />

        <PasswordInput
          label="Password"
          id="password"
          value={formData.password}
          errors={touched.password ? errors.password : undefined}
          handleBlur={() => handleBlur("password")}
          handleChange={(value) => handleChange("password", value)}
        />

        <PasswordInput
          label="Confirm Password"
          id="confirmPassword"
          value={formData.confirmPassword}
          errors={touched.confirmPassword ? errors.confirmPassword! : undefined}
          handleBlur={() => handleBlur("confirmPassword")}
          handleChange={(value) => handleChange("confirmPassword", value)}
        />

        <button
          className={`${isLoading ? "bg-gray-300" : "bg-gray-700"} text-white`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </main>
  );
}

export default function CompletePage() {
  return (
    <Suspense>
      <CompleteContent />
    </Suspense>
  );
}
