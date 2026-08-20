"use client";
import { menuCategories } from "@/constants/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useState } from "react";
import CategoryDropdown from "./CategoryDropdown";
import MenuItems from "./MenuItems";
import SidebarLogo from "./SidebarLogo";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const [selectedCategory, setSelectedCategory] = useState<string>("modules");

  const currentCategory = menuCategories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px] min-w-[275px]"
            : isHovered
            ? "w-[290px] min-w-[275px]"
            : "w-[90px] min-w-[75px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <SidebarLogo
        isExpanded={isExpanded}
        isHovered={isHovered}
        isMobileOpen={isMobileOpen}
      />

      {/* Category Dropdown */}
      <div className="mb-4">
        <CategoryDropdown
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isExpanded={isExpanded}
          isHovered={isHovered}
          isMobileOpen={isMobileOpen}
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {currentCategory && (
              <MenuItems
                items={currentCategory.items}
                menuType="main"
                isExpanded={isExpanded}
                isHovered={isHovered}
                isMobileOpen={isMobileOpen}
              />
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
