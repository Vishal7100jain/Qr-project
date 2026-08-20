"use client";

interface ToggleSwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
}

export const ToggleSwitch = ({
  value,
  onChange,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  className = "",
}: ToggleSwitchProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {value ? activeLabel : inactiveLabel}
      </span>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
          value ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
        }`}
        onClick={() => onChange(!value)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};
