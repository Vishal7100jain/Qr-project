"use client";
import { NavItem } from "@/constants/navigation";
import { useAdminStore } from "@/zustand/admin.store";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface MenuItemsProps {
  items: NavItem[];
  menuType: "main" | "others";
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

const MenuItems: React.FC<MenuItemsProps> = ({
  items,
  menuType,
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  const admin = useAdminStore((state) => state.admin);
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => {
      if (!path) return false;
      return pathname === path || pathname.startsWith(`${path}/`);
    },
    [pathname]
  );

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const hasPermissionToView = (moduleName: string | undefined) =>
    admin?.role?.name === "super_admin" ||
    admin?.role?.access?.some((acc) => acc.module === moduleName);

  return (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const canView =
          hasPermissionToView(nav.moduleName) ||
          (nav.subItems?.some((s) => hasPermissionToView(s.moduleName)) ??
            false);

        if (!canView) return null;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                {nav.icon && <nav.icon size={22} />}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? "rotate-180 text-brand-500"
                          : ""
                      }`}
                    />
                  </>
                )}
              </button>
            ) : (
              <Link
                href={nav.path!}
                className={`menu-item group ${
                  isActive(nav.path!)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                {nav.icon && <nav.icon size={22} />}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )}

            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                // @ts-ignore
                ref={(el) => (subMenuRefs.current[`${menuType}-${index}`] = el)}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map(
                    (s) =>
                      hasPermissionToView(s.moduleName) && (
                        <li key={s.name}>
                          <Link
                            href={s.path}
                            className={`menu-dropdown-item ${
                              isActive(s.path)
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                            }`}
                          >
                            {s.icon && <s.icon size={22} />}
                            {s.name}
                          </Link>
                        </li>
                      )
                  )}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default MenuItems;
