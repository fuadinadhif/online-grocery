"use client";

import { useState } from "react";

import ErrorInput from "./error-input";

interface PasswordInputProps {
  label: string;
  id: string;
  value: string;
  errors?: string[];
  handleBlur: (field: string) => void;
  handleChange: (value: string) => void;
}

export default function PasswordInput({
  label,
  id,
  value,
  errors,
  handleBlur,
  handleChange,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  function toggleIsVisible() {
    setIsVisible(!isVisible);
  }

  return (
    <div className="grid">
      <label htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          className="w-full border border-gray-700"
          type={isVisible ? "text" : "password"}
          id={id}
          value={value}
          onBlur={() => handleBlur(id)}
          onChange={(e) => handleChange(e.target.value)}
        />
        <button
          type="button"
          className="absolute top-0 right-2 bottom-0 cursor-pointer"
          onClick={toggleIsVisible}
        >
          {isVisible ? "👁️" : "🙈"}
        </button>
      </div>
      {errors && <ErrorInput errors={errors} />}
    </div>
  );
}
