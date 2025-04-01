import ErrorInput from "./error-input";

interface TextInputProps {
  label: string;
  type: string;
  id: string;
  value: string;
  errors?: string[];
  handleBlur: () => void;
  handleChange: (value: string) => void;
}

export default function GeneralInput({
  label,
  type,
  id,
  value,
  errors,
  handleBlur,
  handleChange,
}: TextInputProps) {
  return (
    <div className="grid">
      <label htmlFor={id}>{label}</label>
      <input
        className="border border-gray-700"
        type={type}
        id={id}
        value={value}
        onBlur={handleBlur}
        onChange={(e) => handleChange(e.target.value)}
      />
      {errors && <ErrorInput errors={errors} />}
    </div>
  );
}
