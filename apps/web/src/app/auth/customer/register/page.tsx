"use client";

import { ZodError } from "zod";

import { notify } from "@/utils/toastify";
import { RegisterSchema } from "schemas";
import GoogleSignInForm from "@/components/google-sign-in-form";
import { useForm } from "@/hooks/use-form";
import GeneralInput from "@/components/general-input";
import { fetchJsonApi } from "@/utils/fetch-json-api";

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

      const registerData = await fetchJsonApi({
        url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/register`,
        method: "POST",
        body: { ...parsedFormData, provider: "CREDENTIALS" },
        errorMessage: "Failed to register",
      });

      await fetchJsonApi({
        url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/email/verification`,
        method: "POST",
        body: {
          type: "COMPLETE_REGISTRATION",
          email: parsedFormData.email,
          clientURL: "/auth/customer/register/complete",
          expiredInMS: 1000 * 60 * 60,
        },
        errorMessage: "Failed to send verification email",
      });

      notify(registerData.message);
      setFormData({ email: "" });
      setErrors({});
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.flatten().fieldErrors;
        setErrors(errors);
      } else if (error instanceof Error) {
        setErrors({
          form: [error.message || "An unexpected error occurred"],
        });
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

      <GoogleSignInForm className="w-full max-w-96 border border-gray-700 text-center" />
    </main>
  );
}
