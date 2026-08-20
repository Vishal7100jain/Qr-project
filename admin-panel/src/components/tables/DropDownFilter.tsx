"use client";
import { useState } from "react";
import { Label } from "../ui/label"; // Import the Label component
import { Modal } from "../ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const DropdownFilter = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  allowCustom = false,
  label,
  customPlaceholder = "Enter custom value...",
}: {
  value: any;
  onChange: (value: any) => void;
  options: { label: string; value: any }[];
  placeholder?: string;
  allowCustom?: boolean;
  customPlaceholder?: string;
  label?: string;
}) => {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === "__custom__") {
      setCustomInputValue("");
      setIsCustomModalOpen(true);
    } else if (selectedValue === "null") {
      onChange(null);
    } else {
      // Find the original value type from options
      const option = options.find(
        (opt) => opt.value?.toString() === selectedValue
      );
      onChange(option ? option.value : options[0].value);
    }
  };

  const handleCustomSubmit = () => {
    if (customInputValue.trim()) {
      onChange(customInputValue.trim());
      setIsCustomModalOpen(false);
      setCustomInputValue("");
    }
  };

  const handleCustomCancel = () => {
    setIsCustomModalOpen(false);
    setCustomInputValue("");
  };

  // Fix: Handle null values properly for the Select component
  const getSelectValue = () => {
    if (value === null || value === undefined) {
      return "null"; // This should match the "All" option value
    }
    return value.toString();
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Label className="dark:text-white text-sm font-medium">{label} :</Label>
      )}
      <Select value={getSelectValue()} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px] dark:text-white/50">
          <SelectValue placeholder={placeholder} className="" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-500">
          {options.map((option) => (
            <SelectItem
              key={option.value?.toString() || "null"}
              value={option.value?.toString() || "null"}
              className={`ps-2 hover:bg-brand-300 hover:text-white cursor-pointer ${
                (option.value?.toString() || "null") === getSelectValue()
                  ? "bg-brand-500 text-white"
                  : ""
              }`}
            >
              {option.label}
            </SelectItem>
          ))}
          {allowCustom && (
            <SelectItem
              value="__custom__"
              className="font-medium text-blue-600 cursor-pointer"
            >
              + Add custom value
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <Modal
        isOpen={isCustomModalOpen}
        onClose={handleCustomCancel}
        className="max-w-md mx-auto p-6"
        showCloseButton={false}
      >
        <div className="space-y-4">
          <h3 className="flex justify-center items-center text-lg font-semibold text-gray-900 dark:text-white">
            Search with Custom Status Code
          </h3>
          <div className="pt-2">
            <input
              type="text"
              value={customInputValue}
              onChange={(e) => setCustomInputValue(e.target.value)}
              placeholder={customPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCustomSubmit();
                }
              }}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCustomCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleCustomSubmit}
              disabled={!customInputValue.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
