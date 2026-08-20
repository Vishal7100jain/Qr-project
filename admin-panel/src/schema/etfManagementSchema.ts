import * as yup from "yup";

export const CreateETFSchema = yup.object().shape({
  sk: yup
    .string()
    .required("Symbol/Stock name is required.")
    .min(3, "Symbol/Stock name must be at least 3 characters long.")
    .max(200, "Symbol/Stock name must not exceed 200 characters."),
  tp: yup
    .string()
    .required("ETF Type is required.")
    .oneOf(["silver", "gold", "index"], "Invalid ETF Type selected"),
  ud: yup
    .string()
    .required("UD is required.")
    .min(1, "UD must be at least 1 character long.")
    .max(200, "UD must not exceed 200 characters."),
  sn: yup
    .string()
    .required("SN is required.")
    .min(1, "SN must be at least 1 character long.")
    .max(200, "SN must not exceed 200 characters."),
});

export const UpdateETFSchema = yup.object().shape({
  sk: yup
    .string()
    .min(3, "Symbol/Stock name must be at least 3 characters long.")
    .max(200, "Symbol/Stock name must not exceed 200 characters."),
  tp: yup
    .string()
    .oneOf(["silver", "gold", "index"], "Invalid ETF Type selected"),
  ud: yup
    .string()
    .min(1, "UD must be at least 1 character long.")
    .max(200, "UD must not exceed 200 characters."),
  sn: yup
    .string()
    .min(1, "SN must be at least 1 character long.")
    .max(200, "SN must not exceed 200 characters."),
});

export const UploadETFListCSVSchema = yup.object().shape({
  csvData: yup
    .mixed()
    .nullable()
    .required("CSV file is required.")
    .test("fileType", "Only .csv files are allowed", (value: any) => {
      if (!value) return true;
      return value.name?.toLowerCase().endsWith(".csv");
    }),
});
