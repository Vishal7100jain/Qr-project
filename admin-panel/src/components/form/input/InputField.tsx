"use client";
import { ChevronDown } from "lucide-react";
import React, { FC } from "react";

interface InputProps {
  type?:
    | "text"
    | "password"
    | "email"
    | "file"
    | "select"
    | "time"
    | "textarea"
    | "number";
  name: string;
  id?: string;
  label?: string;
  placeholder?: string;
  formik?: any;
  icon?: React.ReactNode;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  hint?: string;
  onChange?: any;
  options?: { value: string; label: string; name?: string }[];
  value?: string | number;
  required?: boolean;
}

const InputField: FC<InputProps> = ({
  type = "text",
  name,
  id,
  label,
  placeholder,
  formik,
  icon,
  maxLength,
  className = "",
  disabled = false,
  hint,
  onChange,
  options = [],
  value,
  required,
}) => {
  const hasError = formik?.touched?.[name] && formik?.errors?.[name];
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (type === "file" && !formik?.values?.[name] && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [formik?.values?.[name], name, type]);

  const baseClasses =
    "h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 transition-all duration-150";

  const stateClasses = disabled
    ? "text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
    : hasError
      ? "border-red-500 text-gray-800 focus:ring-red-300 dark:border-red-500 dark:text-white"
      : "border-gray-300 text-gray-800 focus:border-brand-500 focus:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-500";

  const inputClasses = `${baseClasses} ${stateClasses} ${className} placeholder:text-gray-400 dark:placeholder:text-white`;

  return (
    <div className="w-full relative pb-5">
      {" "}
      {/* Added relative positioning and padding-bottom */}
      <label
        htmlFor={id || name}
        className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-white"
      >
        {label}
        {type !== "file" && required && (
          <span className="text-error-500 ml-1">*</span>
        )}
      </label>
      <div className="relative">
        {type === "select" ? (
          <div className="relative">
            <select
              id={id || name}
              name={name}
              value={formik?.values?.[name]}
              onChange={formik?.handleChange}
              onBlur={formik?.handleBlur}
              disabled={disabled}
              className={`${inputClasses} appearance-none ${
                icon ? "pl-10 pr-10" : "pr-10"
              }`}
            >
              <option
                value=""
                disabled
                // Force gray color regardless of error state
                className="text-gray-400 dark:text-gray-500"
                // Hide the placeholder when a value is selected
                hidden={formik?.values?.[name] !== ""}
              >
                {placeholder || "Select an option"}
              </option>
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-white text-gray-800 dark:bg-gray-800 dark:text-white"
                >
                  {option.label || option.name}
                </option>
              ))}
            </select>
            {icon && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                {icon}
              </span>
            )}
            <ChevronDown
              size={18}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                hasError ? "text-red-500" : "text-gray-400 dark:text-gray-500"
              }`}
            />
          </div>
        ) : type === "file" ? (
          <input
            ref={inputRef}
            type="file"
            id={id || name}
            name={name}
            onChange={onChange || formik?.handleChange}
            onBlur={formik?.handleBlur}
            disabled={disabled}
            className={`${inputClasses} ${icon ? "pl-10" : ""}`}
            accept=".csv,image/*"
          />
        ) : (
          <input
            type={type}
            id={id || name}
            name={name}
            placeholder={placeholder}
            value={formik?.values?.[name]}
            onChange={onChange || formik?.handleChange}
            onBlur={formik?.handleBlur}
            maxLength={maxLength}
            disabled={disabled}
            className={`${inputClasses} ${icon ? "pl-10" : ""}`}
          />
        )}
        {type !== "select" && icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </span>
        )}
      </div>
      {/* Error message positioned absolutely to prevent layout shift */}
      <div className="absolute bottom-[-5px] left-0 w-full">
        {hint && !hasError && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        )}
        {hasError && (
          <p className="text-sm text-error-500 dark:text-error-400">
            {formik?.errors[name] as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default InputField;
