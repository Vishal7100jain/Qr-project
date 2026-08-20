"use client";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { menuCategories } from "@/constants/navigation";
import { useAdminStore } from "@/zustand/admin.store";
import {
  BarChart3,
  CheckIcon,
  ChevronDownIcon,
  FileText,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";
import { HiCpuChip } from "react-icons/hi2";

interface CategoryDropdownProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

// Icon mapping for categories
const categoryIcons: { [key: string]: React.ReactNode } = {
  modules: <HiCpuChip className="w-4 h-4" />,
  system: <Users className="w-4 h-4" />,
  marketData: <BarChart3 className="w-4 h-4" />,
  others: <FileText className="w-4 h-4" />,
};

// Fallback icon for unknown categories
const DefaultIcon = <Settings className="w-4 h-4" />;

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  onCategoryChange,
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentCategory = menuCategories.find(
    (cat) => cat.id === selectedCategory
  );
  const admin = useAdminStore((state) => state.admin);

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId);
    setIsDropdownOpen(false);
  };

  if (!(isExpanded || isHovered || isMobileOpen)) {
    return (
      <div className="flex justify-center p-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-md flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-600">
          <ChevronDownIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </div>
      </div>
    );
  }

  const hasPermissionToView = (moduleName: string | undefined) =>
    admin?.role?.name === "super_admin" ||
    admin?.role?.access?.some((acc) => acc.module === moduleName);

  return (
    <div className="relative">
      {/* Enhanced Dropdown Trigger */}
      <button
        className="dropdown-toggle w-full flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-200 group"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center space-x-2">
          <div className="text-blue-500">
            {categoryIcons[selectedCategory] || DefaultIcon}
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {currentCategory?.label}
          </span>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Enhanced Dropdown Menu */}
      <Dropdown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        className="min-w-[240px] right-0 left-0 shadow-xl border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 backdrop-blur-sm bg-opacity-95"
      >
        <div className="p-2">
          <div className="px-3 py-2 mb-1 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Core Modules
            </p>
          </div>

          {menuCategories.map((category) => {
            const canView =
              (category.items?.some((s) => hasPermissionToView(s.moduleName)) ||
                category.items?.some((s) =>
                  s?.subItems?.some((sub: any) =>
                    hasPermissionToView(sub.moduleName)
                  )
                )) ??
              false;

            if (!canView) return null;
            return (
              <button
                key={category.id}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-all duration-200 group ${
                  selectedCategory === category.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent"
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`transition-colors ${
                      selectedCategory === category.id
                        ? "text-blue-500"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-blue-400"
                    }`}
                  >
                    {categoryIcons[category.id] || DefaultIcon}
                  </div>
                  <span className="font-medium">{category.label}</span>
                </div>

                {selectedCategory === category.id && (
                  <CheckIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                )}
              </button>
            );
          })}

          {/* Footer section */}
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="px-3 py-1">
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                {menuCategories.length} modules available
              </p>
            </div>
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default CategoryDropdown;
