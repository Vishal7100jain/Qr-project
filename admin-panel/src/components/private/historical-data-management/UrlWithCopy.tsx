import { customToast } from "@/components/customToast";
import { useState } from "react";
import { FaCopy, FaRegCopy } from "react-icons/fa6";
import Swal from "sweetalert2";

export const UrlWithCopy = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      customToast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      Swal.fire("Error", "Failed to copy URL", "error");
    }
  };

  return (
    <div
      className="flex items-center gap-2 max-w-[200px] group relative"
      title={url}
    >
      {/* Truncated URL text */}
      <p className="truncate text-gray-800 dark:text-gray-200 max-w-[180px]">
        {url}
      </p>
      {/* Copy button - visible only on hover */}
      {copied ? (
        <FaCopy
          size={16}
          className={`text-gray-600 dark:text-gray-300 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
        />
      ) : (
        <FaRegCopy
          onClick={handleCopy}
          size={16}
          className={`text-gray-600 dark:text-gray-300 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
        />
      )}
    </div>
  );
};
