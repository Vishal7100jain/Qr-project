import * as yup from "yup";

export const CreateIndexSchema = yup.object().shape({
  sk: yup
    .string()
    .required("Index symbol is required.")
    .min(3, "Index symbol must be at least 3 characters long.")
    .max(200, "Index symbol must not exceed 200 characters."),
  sn: yup.string().optional(),
  xc: yup
    .string()
    .required("Exchange is required.")
    .oneOf(
      ["NSE", "BSE", "MCX", "NCO"],
      "Exchange must be NSE, BSE, MCX or NCO"
    ),
  type: yup
    .string()
    .required("Type is required.")
    .oneOf(["high", "medium", "low"], "Type must be high, medium or low"),
  logoUrl: yup.string().url("Must be a valid URL").optional(),
  logo: yup.string().optional(),
});

export const UpdateIndexBySkSchema = yup.object().shape({
  sk: yup
    .string()
    .required("Index symbol is required.")
    .min(3, "Index symbol must be at least 3 characters long.")
    .max(200, "Index symbol must not exceed 200 characters."),
  sn: yup.string().optional(),
  xc: yup
    .string()
    .oneOf(
      ["NSE", "BSE", "MCX", "NCO", "GLOBAL", "NSEIX", "CDS"],
      "Exchange must be NSE, BSE, MCX, NCO, GLOBAL, NSEIX or CDS"
    )
    .optional(),
  type: yup
    .string()
    .oneOf(["high", "medium", "low"], "Type must be high, medium or low")
    .optional(),
  logoUrl: yup.string().url("Must be a valid URL").optional(),
  logo: yup.string().optional(),
});
