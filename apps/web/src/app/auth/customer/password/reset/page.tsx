"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { ResetPasswordSchema, ZodError } from "schemas";
import { notify } from "@/utils/toastify";
import { useForm } from "@/hooks/use-form";
import { fetchJsonApi } from "@/utils/fetch-json-api";
import PasswordInput from "@/components/password-input";

function ResetContent() {
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
  } = useForm(ResetPasswordSchema, {
    newPassword: "",
    confirmPassword: "",
  });
  const searchParams = useSearchParams();
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
        newPassword: true,
        confirmPassword: true,
      });

      const parsedFormData = ResetPasswordSchema.parse(formData);

      const resetPasswordData = await fetchJsonApi({
        url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/password/reset?token=${token}`,
        method: "POST",
        body: parsedFormData,
        credentials: true,
        errorMessage: "Failed to reset data",
      });

      notify(resetPasswordData.message);
      setFormData({ confirmPassword: "", newPassword: "" });
      setErrors({});
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
          Your reset password request has expired. Please re-request if you want
          to reset your password again
        </p>
        <Link
          href="/auth/customer/password/forget"
          className="mt-5 bg-gray-700 px-6 py-2 text-white"
        >
          Forget Password
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

      <form onSubmit={handleSubmit} className="grid w-full max-w-96 gap-4">
        <PasswordInput
          label="New Password"
          id="newPassword"
          value={formData.newPassword}
          errors={touched.newPassword ? errors.newPassword : undefined}
          handleBlur={() => handleBlur("newPassword")}
          handleChange={(value) => handleChange("newPassword", value)}
        />

        <PasswordInput
          label="Confirm Password"
          id="confirmPassword"
          value={formData.confirmPassword}
          errors={touched.confirmPassword ? errors.confirmPassword : undefined}
          handleBlur={() => handleBlur("confirmPassword")}
          handleChange={(value) => handleChange("confirmPassword", value)}
        />

        <button
          className={`${isLoading ? "bg-gray-300" : "bg-gray-700"} text-white`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </main>
  );
}

export default function ResetPage() {
  return (
    <Suspense>
      <ResetContent />
    </Suspense>
  );
}
