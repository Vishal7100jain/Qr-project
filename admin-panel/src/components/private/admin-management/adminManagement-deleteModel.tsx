import { Modal } from "@/components/ui/modal";

const AdminManagementDeleteModel = ({
  setShowPasswordModal,
  showPasswordModal,
  setPassword,
  password,
  handleSuperAdminDelete,
  isDeleting,
}: {
  password: string;
  isDeleting: boolean;
  showPasswordModal: boolean;
  setPassword: (value: string) => void;
  setShowPasswordModal: (value: boolean) => void;
  handleSuperAdminDelete: () => void;
}) => {
  return (
    <>
      {/* Super Admin Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPassword("");
        }}
        className="max-w-md mx-4"
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Super Admin
            </h3>
            <p className="text-sm text-red-600 font-medium mb-2">
              ⚠️ You are about to delete a Super Admin account!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Please enter the Super Admin password to confirm this critical
              action:
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="super-admin-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Super Admin Password
            </label>
            <input
              id="super-admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Super Admin Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSuperAdminDelete();
                }
              }}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowPasswordModal(false);
                setPassword("");
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSuperAdminDelete}
              disabled={isDeleting || !password.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                "Delete Super Admin"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminManagementDeleteModel;
