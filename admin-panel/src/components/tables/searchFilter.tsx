import { Search, X } from "lucide-react";
import { ReactNode, useId } from "react"; // Import useId hook
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const SearchFilter = ({
  value,
  onChange,
  placeholder = "Search...",
  label,
  Icon,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  Icon?: ReactNode;
}) => {
  // Generate a unique ID for the input
  const inputId = useId();

  return (
    <div className="relative w-full max-w-sm">
      {label && (
        <Label
          htmlFor={inputId} // Associate label with input
          className="dark:text-white pb-2 cursor-pointer" // Add cursor-pointer for better UX
        >
          {label} :
        </Label>
      )}
      <div className="relative flex items-center">
        {Icon}
        <Input
          id={inputId} // Add id to input
          placeholder={placeholder}
          className="pl-9 pr-9 w-full placeholder:text-muted-foreground dark:placeholder:text-white/50 dark:text-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <X
            className="absolute right-3 h-4 w-4 cursor-pointer text-muted-foreground hover:opacity-75 transition-opacity dark:text-white/50"
            onClick={() => onChange("")}
          />
        )}
      </div>
    </div>
  );
};
