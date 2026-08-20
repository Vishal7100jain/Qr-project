// components/ConfigSwitch.tsx
interface ConfigSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const ConfigSwitch = ({
  label,
  checked,
  onChange,
}: ConfigSwitchProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1 text-[12px] text-gray-500 dark:text-gray-400">
        {label}
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mb-0.5" />
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border transition-all duration-200 focus:outline-none
          ${
            checked
              ? "bg-blue-600 border-blue-600"
              : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full transform transition-transform duration-200 mt-[2px]
            ${
              checked
                ? "translate-x-[18px] bg-white"
                : "translate-x-[2px] bg-gray-400 dark:bg-gray-500"
            }`}
        />
      </button>
    </div>
  );
};
