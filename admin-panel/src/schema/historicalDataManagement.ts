import * as yup from "yup";

export const insertHistoricalDataByRangeSchema = yup.object({
  startDate: yup.date().required("Start Date is required"),

  endDate: yup
    .date()
    .required("End Date is required")
    .min(
      yup.ref("startDate"),
      "End Date must be greater than or equal to Start Date"
    ),

  config: yup
    .object()
    .test(
      "at-least-one-enabled",
      "Please enable at least one data type/timeframe",
      (value) => {
        if (!value) return false;

        return Object.values(value).some(
          (item: any) => item.minute || item.day
        );
      }
    ),
});
