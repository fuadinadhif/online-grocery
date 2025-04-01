"use client";

import { ZodError } from "zod";

import { notify } from "@/utils/toastify";
import { RegisterSchema } from "@/schemas/auth";
import SignInForm from "@/components/google-sign-in-form";
import { useForm } from "@/hooks/use-form";
import GeneralInput from "@/components/general-input";

export default function RegisterPage() {
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
  } = useForm(RegisterSchema, {
    email: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();

      setIsLoading(true);
      setTouched({
        email: true,
      });

      const parsedFormData = RegisterSchema.parse(formData);

      const registerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...parsedFormData,
            provider: "CREDENTIALS",
          }),
        },
      );
      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setErrors((prev) => ({
          ...prev,
          form: registerData.message || ["Failed to register"],
        }));
      } else {
        notify(registerData.message);
        setFormData({ email: "" });
        setErrors({});
      }

      setIsLoading(false);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.flatten().fieldErrors;
        setErrors(errors);
      } else if (error instanceof Error) {
        setErrors({
          form: [error.message || "An unexpected error occurred"],
        });
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

        <button
          type="submit"
          disabled={isLoading}
          className={`${isLoading ? "bg-gray-300" : "bg-gray-700"} text-white`}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>

      <div className="my-10 flex w-full max-w-96 items-center gap-2">
        <div className="h-0 w-full border-b-[0.025rem] border-gray-700"></div>
        <span>Or</span>
        <div className="h-0 w-full border-b-[0.025rem] border-gray-700"></div>
      </div>

      <SignInForm className="w-full max-w-96 border border-gray-700 text-center" />
    </main>
  );
}
