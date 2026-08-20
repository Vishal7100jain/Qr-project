"use client";
import React, { HTMLAttributes, useEffect, useState } from "react";

interface SwitchProps {
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "blue" | "gray";
  checked?: boolean; // For controlled mode
  className?: HTMLAttributes<HTMLLabelElement> | string;
}

const Switch: React.FC<SwitchProps> = ({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  color = "blue",
  checked, // Now supporting controlled mode
  className,
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  // If `checked` is provided, sync internal state with it
  useEffect(() => {
    if (typeof checked === "boolean") {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const newCheckedState = !isChecked;
    if (typeof checked !== "boolean") {
      setIsChecked(newCheckedState); // Only update local state if uncontrolled
    }
    onChange?.(newCheckedState);
  };

  const switchColors =
    color === "blue"
      ? {
          background: isChecked
            ? "bg-brand-500"
            : "bg-gray-200 dark:bg-white/10",
          knob: isChecked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        }
      : {
          background: isChecked
            ? "bg-gray-800 dark:bg-white/10"
            : "bg-gray-200 dark:bg-white/10",
          knob: isChecked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        };

  return (
    <label
      className={`flex flex-col items-start gap-1 cursor-pointer select-none text-sm font-medium ${
        disabled ? "text-gray-400" : "text-gray-700 dark:text-white"
      } ${className}`}
    >
      <div className="flex items-center gap-1">
        {label}
        <span className="text-error-500">*</span>
      </div>

      <div className="relative" onClick={handleToggle}>
        <div
          className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${
            disabled
              ? "bg-gray-100 pointer-events-none dark:bg-gray-800"
              : switchColors.background
          }`}
        ></div>
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform ${switchColors.knob}`}
        ></div>
      </div>
    </label>
  );
};

export default Switch;
