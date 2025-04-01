"use client";

import { ZodError } from "zod";
import { useRouter } from "next/navigation";

import { LoginSchema } from "@/schemas/auth";
import SignInForm from "@/components/google-sign-in-form";
import { notify } from "@/utils/toastify";
import { useForm } from "@/hooks/use-form";
import GeneralInput from "@/components/general-input";
import PasswordInput from "@/components/password-input";

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

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();

      setIsLoading(true);
      setTouched({ email: true, password: true });

      const parsedFormData = LoginSchema.parse(formData);

      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedFormData),
          credentials: "include",
        },
      );

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setErrors((prev) => ({
          ...prev,
          form: loginData.message || ["Failed to login"],
        }));
      } else {
        notify(loginData.message);
        setFormData({ email: "", password: "" });
        setErrors({});
        router.push("/");
      }

      setIsLoading(false);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.flatten().fieldErrors;
        setErrors(errors);
      } else if (error instanceof Error) {
        console.log(error);
        setErrors((prev) => ({
          ...prev,
          form: [error.message || "An unexpected error occurred"],
        }));
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
