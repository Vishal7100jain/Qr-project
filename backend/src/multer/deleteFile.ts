import fs from "fs";

/**
 * Deletes a file from the uploads directory based on the provided path
 * @param filePath The relative path of the file to delete (e.g., '/admin-profile/filename.jpg')
 * @returns Promise<boolean> - true if deletion was successful, false otherwise
 */
export const deleteFile = (filePath: string | any): Promise<boolean> => {
  if (filePath) {
    return new Promise((resolve) => {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return resolve(false);
      }

      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}:`, err);
          return resolve(false);
        }
        console.warn(`Successfully deleted file: ${filePath}`);
        resolve(true);
      });
    });
  }
  return new Promise((resolve) => resolve(true));
};
