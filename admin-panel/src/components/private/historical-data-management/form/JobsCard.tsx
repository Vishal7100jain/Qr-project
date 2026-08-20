import { IJobs } from "@/zustand/apiJob.store";
import { FC } from "react";
import { FiDatabase, FiInfo, FiStopCircle } from "react-icons/fi";

interface JobsCard {
  title: string;
  jobs: IJobs[];
  slug: "active" | "completed";
  stopHistoricalInsertion: (jobId: string) => void;
}

const JobsCard: FC<JobsCard> = ({
  title,
  jobs,
  slug,
  stopHistoricalInsertion,
}) => {
  return (
    <>
      {jobs.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {title}
            </h3>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {jobs.length} running
            </span>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => {
              const jobTitle = job.msg?.split(" - ")?.[0] || job.msg;
              const id = job.jobId;

              return (
                <div
                  key={id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-2 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <FiDatabase className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-md font-semibold text-gray-900 dark:text-gray-100">
                        {jobTitle}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Job ID: {id}
                      </span>
                    </div>
                  </div>

                  {slug === "active" && (
                    <button
                      type="button"
                      onClick={() => stopHistoricalInsertion(id)}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Stop Job"
                    >
                      <FiStopCircle className="w-8 h-8" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default JobsCard;
