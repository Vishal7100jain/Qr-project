import { Modal } from "@/components/ui/modal";
import Image from "next/image";

interface GenericDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  data: Record<string, any>; // dynamic key-value data
  fieldLabels?: Record<string, string>; // optional custom labels
  className?: string;
  image?: string;
}

const GenericDetailsModal = ({
  isOpen,
  onClose,
  title,
  description,
  data,
  fieldLabels = {},
  className,
  image,
}: GenericDetailsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md mx-4">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            {image?.length ? (
              <div className="w-full h-full relative">
                <Image
                  src={image}
                  alt="user"
                  fill
                  className="rounded-full object-cover border border-gray-200"
                />
              </div>
            ) : (
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-start">
              <span className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize break-words">
                {fieldLabels[key] || key.replace(/([A-Z])/g, " $1")}
              </span>
              <span
                className={`${className} w-2/3 text-sm text-gray-900 dark:text-white break-words`}
              >
                {typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)
                  ? new Date(value).toLocaleString()
                  : String(value)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GenericDetailsModal;
