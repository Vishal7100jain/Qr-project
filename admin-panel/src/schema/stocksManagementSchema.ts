import * as yup from "yup";

export const CreateSymbolStockSchema = yup.object().shape({
  sk: yup
    .string()
    .required("Symbol/Stock name is required.")
    .min(3, "Symbol/Stock name must be at least 3 characters long.")
    .max(200, "Symbol/Stock name must not exceed 200 characters."),

  xc: yup
    .string()
    .required("Exchange is required.")
    .oneOf(["NSE", "BSE", "MCX", "NCO"], "Exchange must be either NSE or BSE"),

  sn: yup.string().optional(),
  indices: yup.array().of(yup.string()).optional(),
});

export const UploadStockListCSVSchema = yup.object().shape({
  csvData: yup
    .mixed()
    .required("CSV file is required.")
    .test("fileType", "Only .csv files are allowed", (value: any) => {
      return value && value?.name?.endsWith(".csv");
    }),
});
