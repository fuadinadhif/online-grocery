import { useState } from "react";
import { ZodError, ZodSchema } from "zod";

export function useForm<T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
  initialValues: T,
) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof T | "form", string[]>>
  >({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);

  function validateField(field: keyof T, value: unknown) {
    try {
      // @ts-expect-error the field is dynamic
      schema.pick({ [field]: true }).parse({
        [field]: value,
      });

      if (field === "confirmPassword") {
        if (formData.password !== value) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: ["Passwords do not match"],
          }));
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }
      } else {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
    }
  }

  function handleBlur(field: keyof T) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  }

  function handleChange(field: keyof T, value: unknown) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      validateField(field, value);
    }
  }

  return {
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
  };
}
