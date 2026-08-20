import { useTheme } from "@/context/ThemeContext";
import React from "react";
import Select, { StylesConfig, components } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: { value: string | number; label: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  name?: string;
  id?: string;
  formik?: any;
  type?: string;
  icon?: React.ReactNode;
  label?: string;
  value?: string | number;
  disabled?: boolean;
}

const SingleSelect: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  name,
  id,
  formik,
  type,
  icon,
  label,
  value,
  disabled = false,
}) => {
  const { theme } = useTheme();

  const Control = ({ children, ...props }: any) => {
    return (
      <components.Control {...props}>
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        {children}
      </components.Control>
    );
  };

  // Light theme styles
  const lightStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "44px",
      borderRadius: "0.5rem",
      borderColor:
        formik?.touched[name!] && formik?.errors[name!]
          ? "#ef4444"
          : state.isFocused
            ? "#a5b4fc"
            : "#d1d5db",
      boxShadow: state.isFocused
        ? formik?.touched[name!] && formik?.errors[name!]
          ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
          : "0 0 0 3px rgba(199, 210, 254, 0.5)"
        : "none",
      backgroundColor: "white",
      "&:hover": {
        borderColor:
          formik?.touched[name!] && formik?.errors[name!]
            ? "#ef4444"
            : state.isFocused
              ? "#a5b4fc"
              : "#d1d5db",
      },
      paddingLeft: icon ? "30px" : "16px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#e0e7ff"
        : state.isFocused
          ? "#f3f4f6"
          : "white",
      color: state.isSelected ? "#3730a3" : "#111827",
      "&:active": {
        backgroundColor: "#e0e7ff",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#111827",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "14px",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "0.5rem",
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      backgroundColor: "white",
      zIndex: 50,
    }),
    input: (provided: any) => ({
      ...provided,
      color: "#111827",
    }),
  };

  // Dark theme styles
  const darkStyles: any = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "44px",
      borderRadius: "0.5rem",
      borderColor:
        formik?.touched[name!] && formik?.errors[name!]
          ? "#ef4444"
          : state.isFocused
            ? "#7c3aed"
            : "#374151",
      boxShadow: state.isFocused
        ? formik?.touched[name!] && formik?.errors[name!]
          ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
          : "0 0 0 3px rgba(124, 58, 237, 0.5)"
        : "none",
      backgroundColor: "#101828",
      "&:hover": {
        borderColor:
          formik?.touched[name!] && formik?.errors[name!]
            ? "#ef4444"
            : state.isFocused
              ? "#7c3aed"
              : "#4b5563",
      },
      paddingLeft: icon ? "30px" : "16px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#6d28d9"
        : state.isFocused
          ? "#1f2937"
          : "#111827",
      color: state.isSelected ? "#f3f4f6" : "#e5e7eb",
      "&:active": {
        backgroundColor: "#6d28d9",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#f3f4f6",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#fff",
      fontSize: "14px",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "0.5rem",
      border: "1px solid #374151",
      backgroundColor: "#111827",
      zIndex: 50,
    }),
    input: (provided: any) => ({
      ...provided,
      color: "#f3f4f6",
    }),
  };

  const handleChange: any = (selectedOption: Option | null) => {
    const value = selectedOption?.value || "";
    onChange(value);
    if (formik && name) {
      formik.setFieldValue(name, value);
      formik.setFieldTouched(name, true, false);
    }
  };

  const selectedOption =
    options.find(
      (opt) => opt.value === (formik?.values[name!] || defaultValue)
    ) || null;

  return (
    <div className="w-full relative pb-5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
        >
          {label}
          {<span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <Select
        isDisabled={disabled}
        options={options}
        styles={theme === "dark" ? darkStyles : lightStyles}
        placeholder={placeholder}
        onChange={handleChange}
        value={selectedOption}
        className={className}
        classNamePrefix="select"
        isSearchable
        name={name}
        id={id}
        components={{
          Control,
          IndicatorSeparator: () => null,
        }}
        onBlur={() => {
          if (formik && name) {
            formik.setFieldTouched(name, true, true);
          }
        }}
      />
      {formik?.touched[name!] && formik?.errors[name!] && (
        <div className="absolute left-0 text-sm text-error-500 dark:text-error-400">
          {formik.errors[name!]}
        </div>
      )}
    </div>
  );
};

export default SingleSelect;
