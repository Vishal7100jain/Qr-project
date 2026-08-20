"use client";
import Image from "next/image";
import Link from "next/link";

interface SidebarLogoProps {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  return (
    <div
      className={`flex ${
        !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
      }`}
    >
      <Link href="/">
        {isExpanded || isHovered || isMobileOpen ? (
          <div className="flex items-center p-4 py-5 gap-1">
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={36}
              height={36}
              priority
            />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white leading-2">
              Chart Pilot
            </h1>
          </div>
        ) : (
          <div className="py-6">
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={36}
              height={36}
            />
          </div>
        )}
      </Link>
    </div>
  );
};

export default SidebarLogo;
