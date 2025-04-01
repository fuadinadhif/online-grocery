"use client";

import { useSearchParams } from "next/navigation";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";

import { notify } from "@/utils/toastify";
import { useForm } from "@/hooks/use-form";
import { CompleteRegistrationSchema } from "@/schemas/auth";
import PasswordInput from "@/components/password-input";
import GeneralInput from "@/components/general-input";

export default function CompleteRegistrationPage() {
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

      const token = searchParams.get("token");
      if (!token) {
        setErrors((prev) => ({ ...prev, form: ["Token is required"] }));
        setIsLoading(false);
        return;
      }

      const validateTokenResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/validate-token`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        },
      );

      const tokenData = await validateTokenResponse.json();

      if (!validateTokenResponse.ok) {
        setErrors((prev) => ({
          ...prev,
          form: [tokenData.message || "Invalid or expired token"],
        }));
        setIsLoading(false);

        return;
      }

      const completeRegistrationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/complete-registration`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...parsedFormData,
            email: tokenData.data.email,
          }),
        },
      );

      const completeRegistrationData =
        await completeRegistrationResponse.json();

      if (!completeRegistrationResponse.ok) {
        setErrors((prev) => ({
          ...prev,
          form: [
            completeRegistrationData.message ||
              "Failed to complete registration",
          ],
        }));
      } else {
        notify(completeRegistrationData.message);
        setFormData({ name: "", password: "", confirmPassword: "" });
        setErrors({});
        router.push("/auth/customer/sign-in");
      }

      setIsLoading(false);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.flatten().fieldErrors;
        setErrors(errors);
      } else if (error instanceof Error) {
        setErrors({ form: [error.message || "An unexpected error occured"] });
      }

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
