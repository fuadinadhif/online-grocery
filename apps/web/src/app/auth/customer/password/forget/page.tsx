"use client";

import GeneralInput from "@/components/general-input";
import { useForm } from "@/hooks/use-form";
import { fetchJsonApi } from "@/utils/fetch-json-api";
import { notify } from "@/utils/toastify";
import { ForgetPasswordSchema, ZodError } from "schemas";

export default function ForgetPage() {
  const form = useForm(ForgetPasswordSchema, { email: "" });

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();

      form.setIsLoading(true);
      form.setTouched({ email: true });

      const parsedFormData = ForgetPasswordSchema.parse(form.formData);

      await fetchJsonApi({
        url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/email/verification`,
        method: "POST",
        body: {
          type: "RESET_PASSWORD",
          email: parsedFormData.email,
          clientURL: "/auth/customer/password/reset",
        },
        errorMessage: "Failed to send verification email",
      });

      notify("Email sent. Please check your inbox");
      form.setFormData({ email: "" });
      form.setErrors({});
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.flatten().fieldErrors;
        form.setErrors(errors);
      } else if (error instanceof Error) {
        form.setErrors({
          form: [error.message || "An unexpected error occured"],
        });
      }
    } finally {
      form.setIsLoading(false);
    }
  }

  return (
    <main className="max-wrapper grid flex-1 auto-rows-min place-items-center content-center">
      {form.errors.form && (
        <p className="mb-5 w-full max-w-96 bg-red-300 py-2 text-center">
          {form.errors.form}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid w-full max-w-96 gap-4">
        <GeneralInput
          label="Email"
          id="email"
          type="email"
          value={form.formData.email}
          errors={form.touched.email ? form.errors.email : undefined}
          handleBlur={() => form.handleBlur("email")}
          handleChange={(value) => form.handleChange("email", value)}
        />
        <button
          className={`${form.isLoading ? "bg-gray-300" : "bg-gray-700"} text-white`}
          type="submit"
          disabled={form.isLoading}
        >
          {form.isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
