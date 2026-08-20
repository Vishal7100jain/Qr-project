"use client";

import {
  GetHistoricalJobIdsAction,
  InsertAllHistoricalDataAction,
  InsertHistoricalDataByRangeAction,
  InsertHistoricalDataBySymbolsAction,
} from "@/action/historicalDataManagementAction/historicalDataManagementAction";
import { customToast } from "@/components/customToast";
import InputField from "@/components/form/input/InputField";
import Switch from "@/components/form/switch/Switch";
import Button from "@/components/ui/button/Button";
import { DatePicker } from "@/components/ui/datePicker/datePicker";
import { Loader } from "@/components/ui/loader";
import SocketManager from "@/config/backendSocket.config";
import { insertHistoricalDataByRangeSchema } from "@/schema/historicalDataManagement";
import { useAdminStore } from "@/zustand/admin.store";
import { useApiJobStore } from "@/zustand/apiJob.store";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { BiSolidCalendarHeart } from "react-icons/bi";
import { FaList } from "react-icons/fa6";
import { FiDatabase, FiPlay } from "react-icons/fi";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { ConfigSwitch } from "./ConfigSwitch";
import JobsCard from "./JobsCard";
import AllDataInstruction from "./allDataInstruction";
import RangeInstruction from "./rangeInstruction";

const initialCallConfig = {
  stocks: { minute: false, day: false },
  index: { minute: false, day: false },
  options: { minute: false, day: false },
  futures: { minute: false, day: false },
};

const AddHistoricalDataForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [isRangeCustomMode, setIsRangeCustomMode] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(1);

  const jobs = useApiJobStore((state) => state.jobs);
  const setJobIds = useApiJobStore((state) => state.setJobIds);
  const email = useAdminStore((state) => state.admin?.email);

  // Validation
  const validationSchema = useMemo(
    () =>
      isRangeCustomMode
        ? insertHistoricalDataByRangeSchema
        : isRangeMode
          ? Yup.object().shape({
              symbols: Yup.string().required("Symbols are required"),
            })
          : Yup.object().shape({}),
    [isRangeMode, isRangeCustomMode]
  );

  const initialValues = useMemo(() => {
    console.log(isRangeCustomMode);
    return isRangeCustomMode
      ? {
          startDate: null,
          endDate: null,
          config: initialCallConfig,
        }
      : isRangeMode
        ? { symbols: "" }
        : {};
  }, [isRangeMode, isRangeCustomMode]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values: any) => {
      if (isConfigEmpty && isRangeMode && isRangeCustomMode === true) {
        customToast.error("Please enable at least one config option");
        return;
      }

      const warning = isRangeMode
        ? "Are you sure you want to insert data by range?"
        : "Are you sure you want to Start Data insertion fully?";

      const result = await Swal.fire({
        title: "Confirmation Required",
        text: warning,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0e7490",
        cancelButtonColor: "#f05252",
        confirmButtonText: "Yes, Start the process!",
      });

      if (!result.isConfirmed) return;

      setIsLoading(true);

      try {
        let response;

        if (isRangeMode) {
          if (isRangeCustomMode === false) {
            const payload = {
              symbols: values.symbols
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
            };

            response = await InsertHistoricalDataBySymbolsAction(payload);
            formik.resetForm({
              values: {
                symbols: "",
              },
            });
          } else if (values.startDate && values.endDate) {
            const payload = {
              startDate: moment(values.startDate).format("YYYY-MM-DD"),
              endDate: moment(values.endDate).format("YYYY-MM-DD"),
              config: values.config,
            };

            response = await InsertHistoricalDataByRangeAction(payload);
            formik.resetForm({
              values: {
                startDate: null,
                endDate: null,
                config: initialCallConfig,
              },
            });
          }
        } else {
          response = await InsertAllHistoricalDataAction();
        }

        if (response?.status === "success") {
          await fetchJobIds();
          customToast.success(response.message || "Operation completed");
        } else {
          customToast.error(
            response?.message || "An unexpected error occurred"
          );
        }
      } catch (error) {
        customToast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const toggleConfig = (
    type: "stocks" | "index" | "options" | "futures",
    tf: "minute" | "day"
  ) => {
    formik.setFieldValue("config", {
      ...formik.values.config,
      [type]: {
        ...formik.values.config[type],
        [tf]: !formik.values.config[type][tf],
      },
    });
  };

  const isConfigEmpty = useMemo(() => {
    if (!formik.values.config) return false;
    return Object.values(formik.values.config).every(
      (item: any) => !item.minute && !item.day
    );
  }, [formik.values.config]);

  const stopHistoricalInsertion = (jobId: string) => {
    if (!jobId) return;
    SocketManager.emit("stop_historical_insertion", { jobId });
    fetchJobIds();
  };

  const { activeJobs, completedJobs } = useMemo(() => {
    const activeJobs = jobs.filter((item) => item.isRunning);
    const completedJobs = jobs.filter((item) => !item.isRunning);
    return { activeJobs, completedJobs };
  }, [jobs]);

  const fetchJobIds = async () => {
    try {
      if (!email) return;
      const response = await GetHistoricalJobIdsAction(email, page, pageSize);
      if (response?.status === "success") {
        setJobIds(response?.data?.data);
        setTotalPages(Math.ceil(response?.data?.total / 4) || 1);
      }
    } catch {
      customToast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchJobIds();
  }, [email, page]);

  return (
    <div className="w-1/2">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <form onSubmit={formik.handleSubmit} className="w-full p-6">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiDatabase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {isRangeMode ? "Insert by Date Range" : "Insert All Data"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isRangeMode
                    ? "Insert historical data for specific symbols and date range"
                    : "Insert complete historical data for all instruments"}
                </p>
              </div>
            </div>

            <Switch
              label="Date Range Mode"
              checked={isRangeMode}
              onChange={() => setIsRangeMode((prev) => !prev)}
              className={"flex-row items-center"}
            />
          </div>

          {/* RANGE MODE */}
          {isRangeMode && (
            <>
              {/* TAB SWITCHER */}
              <div className="flex w-full justify-center mb-4">
                <div
                  className="flex w-2/4 rounded-full p-1 justify-center"
                  style={{ background: "#1e3a6e" }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      formik.resetForm({
                        values: {
                          symbols: "",
                        },
                      });
                      setIsRangeCustomMode(false);
                    }}
                    className={`flex w-1/2 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all duration-200
                  ${
                    !isRangeCustomMode
                      ? "bg-white text-blue-900 shadow-md"
                      : "text-white/65 hover:text-white/90"
                  }`}
                  >
                    <FaList size={13} />
                    Insert by Symbols
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      formik.resetForm({
                        values: {
                          startDate: null,
                          endDate: null,
                          config: initialCallConfig,
                        },
                      });
                      setIsRangeCustomMode(true);
                    }}
                    className={`flex w-1/2 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all duration-200
                    ${
                      isRangeCustomMode
                        ? "bg-white text-blue-900 shadow-md"
                        : "text-white/65 hover:text-white/90"
                    }`}
                  >
                    <BiSolidCalendarHeart size={15} />
                    Insert by Date
                  </button>
                </div>
              </div>

              {isRangeCustomMode ? (
                <>
                  {/* DATE PICKERS */}
                  <div className="flex w-full mb-4 justify-center">
                    <div className="flex-1">
                      <DatePicker
                        selected={formik.values.startDate}
                        onChange={({ startDate }: any) =>
                          formik.setFieldValue("startDate", startDate)
                        }
                        placeholderText="Start Date"
                        open={openStart}
                        setOpen={setOpenStart}
                      />

                      {formik.touched.startDate && formik.errors.startDate && (
                        <p className="mt-1 text-sm text-red-500">
                          {formik.errors.startDate as any}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <DatePicker
                        selected={formik.values.endDate}
                        onChange={({ endDate }: any) =>
                          formik.setFieldValue("endDate", endDate)
                        }
                        placeholderText="End Date"
                        open={openEnd}
                        setOpen={setOpenEnd}
                      />

                      {formik.touched.endDate && formik.errors.endDate && (
                        <p className="mt-1 text-sm text-red-500">
                          {formik.errors.endDate as any}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CONFIG CARDS */}
                  <div className="grid grid-cols-4 gap-2.5 w-full mb-4">
                    {Object.entries(formik.values.config).map(
                      ([type, value]: any) => (
                        <div
                          key={type}
                          className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/50 p-3.5 shadow-sm"
                        >
                          <p className="text-[13px] font-semibold capitalize tracking-wide text-gray-800 dark:text-gray-100">
                            {type}
                          </p>

                          <ConfigSwitch
                            label="Minute"
                            checked={value.minute}
                            onChange={() => toggleConfig(type as any, "minute")}
                          />

                          <ConfigSwitch
                            label="Day"
                            checked={value.day}
                            onChange={() => toggleConfig(type as any, "day")}
                          />
                        </div>
                      )
                    )}
                  </div>
                  {formik.touched.config && formik.errors.config && (
                    <p className="mt-2 text-sm text-red-500">
                      {formik.errors.config as string}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <InputField
                    type="text"
                    label="Symbols (comma-separated)"
                    name="symbols"
                    placeholder="e.g., TCS, INFY, RELIANCE"
                    formik={formik}
                    className="pb-2"
                  />
                </>
              )}

              <RangeInstruction />
            </>
          )}

          {!isRangeMode && <AllDataInstruction />}

          {/* SUBMIT */}
          <div className="flex gap-3 mt-8">
            <Button
              type="submit"
              disabled={
                isLoading ||
                (isRangeMode &&
                  isRangeCustomMode === false &&
                  !formik.values.symbols) ||
                (isRangeCustomMode && isConfigEmpty)
              }
              className="flex-1 py-3"
            >
              <FiPlay className="mr-2" />
              {isLoading ? "Processing..." : "Start Data Insertion"}
              {isLoading && <Loader className="ml-2" />}
            </Button>
          </div>

          {/* JOBS */}
          <JobsCard
            jobs={activeJobs}
            stopHistoricalInsertion={stopHistoricalInsertion}
            title="Active Jobs"
            slug="active"
          />

          <JobsCard
            jobs={completedJobs}
            slug="completed"
            title="Completed Jobs"
            stopHistoricalInsertion={() => {}}
          />
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 dark:text-white"
            >
              Prev
            </button>

            <span className="text-sm dark:text-white">
              Page {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 dark:text-white"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHistoricalDataForm;
