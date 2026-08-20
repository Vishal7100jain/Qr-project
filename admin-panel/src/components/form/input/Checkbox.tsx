import type React from "react";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  className?: string;
  id?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
  error?: string | boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  onChange,
  className = "",
  disabled = false,
  name,
  value,
  error = false,
}) => {
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1">
      <label
        className={`flex items-center space-x-3 group ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        <div className="relative w-5 h-5">
          <input
            id={id}
            type="checkbox"
            className={`w-5 h-5 appearance-none ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            } dark:border-gray-700 border ${
              hasError ? "border-red-500" : "border-gray-300"
            } checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60 
            ${className}`}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            name={name}
            value={value}
          />
          {checked && (
            <svg
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                stroke="white"
                strokeWidth="1.94437"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        {label && (
          <span
            className={`text-sm font-medium ${
              hasError
                ? "text-red-600 dark:text-red-500"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {label}
          </span>
        )}
      </label>
      {hasError && typeof error === "string" && (
        <p className="text-xs text-red-600 dark:text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Checkbox;
