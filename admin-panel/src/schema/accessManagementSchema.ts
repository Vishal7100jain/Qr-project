import * as yup from "yup";

export const CreateAccessSchema = yup.object().shape({
  moduleName: yup
    .string()
    .required("Module name is required.")
    .min(3, "Module name must be at least 3 characters long.")
    .max(100, "Module name must not exceed 100 characters."),

  permissions: yup
    .array()
    .min(1, "At least one permission is required.")
    .required("Permission is required."),
});

export const UpdateAccessSchema = yup.object().shape({
  moduleName: yup
    .string()
    .required("Module name is required.")
    .min(3, "Module name must be at least 3 characters long.")
    .max(100, "Module name must not exceed 100 characters.")
    .optional(),

  permissions: yup
    .array()
    .min(1, "At least one permission is required.")
    .required("Permission is required.")
    .optional(),
});
