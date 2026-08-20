import { useTheme } from "@/context/ThemeContext";
import React from "react";
import Select, { MultiValue, StylesConfig, components } from "react-select";

interface Option {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: (string | number)[]) => void;
  className?: string;
  name?: string;
  id?: string;
  formik?: any;
  icon?: React.ReactNode;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  placeholder = "Select options",
  onChange,
  className = "",
  name,
  id,
  formik,
  icon,
  label,
  disabled = false,
  required,
}) => {
  const { theme } = useTheme();

  // Custom Control (icon support)
  const Control = ({ children, ...props }: any) => (
    <components.Control {...props}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      )}
      {children}
    </components.Control>
  );

  // Light Theme Style
  const lightStyles: StylesConfig<Option, true> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "44px",
      borderRadius: "0.5rem",
      paddingLeft: icon ? "30px" : "16px",
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
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
      borderRadius: "9999px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#111827",
      padding: "0.25rem 0.5rem",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#6b7280",
      ":hover": {
        backgroundColor: "#d1d5db",
        color: "#111827",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#e0e7ff"
        : state.isFocused
          ? "#f3f4f6"
          : "white",
      color: state.isSelected ? "#3730a3" : "#111827",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      border: "1px solid #e5e7eb",
      zIndex: 50,
    }),
  };

  // Dark Theme Style
  const darkStyles: StylesConfig<Option, true> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "35px",
      borderRadius: "0.5rem",
      paddingLeft: icon ? "30px" : "16px",
      borderColor:
        formik?.touched[name!] && formik?.errors[name!]
          ? "#ef4444"
          : state.isFocused
            ? "#7c3aed"
            : "#374151",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(124, 58, 237, 0.5)" : "none",
      backgroundColor: "#101828",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937",
      borderRadius: "9999px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#f3f4f6",
      padding: "0.25rem 0.5rem",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#9ca3af",
      ":hover": {
        backgroundColor: "#374151",
        color: "#f3f4f6",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#6d28d9"
        : state.isFocused
          ? "#1f2937"
          : "#111827",
      color: "#f3f4f6",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      border: "1px solid #374151",
      backgroundColor: "#111827",
      zIndex: 50,
    }),
  };

  // Change Handle
  const handleChange = (selected: MultiValue<Option>) => {
    const values = selected.map((opt) => opt.value);

    onChange?.(values);

    if (formik && name) {
      formik.setFieldValue(name, values);
      formik.setFieldTouched(name, true, false);
    }
  };

  // Selected Option
  const selectedOptions =
    options.filter((opt) =>
      (formik?.values[name!] || []).includes(opt.value)
    ) || [];

  return (
    <div className="w-full relative pb-5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <Select
        isMulti
        isDisabled={disabled}
        options={options}
        styles={theme === "dark" ? darkStyles : lightStyles}
        placeholder={placeholder}
        value={selectedOptions}
        onChange={handleChange}
        name={name}
        id={id}
        className={className}
        classNamePrefix="select"
        closeMenuOnSelect={false}
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
        <div className="absolute left-0 text-sm text-error-500">
          {formik.errors[name!]}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
