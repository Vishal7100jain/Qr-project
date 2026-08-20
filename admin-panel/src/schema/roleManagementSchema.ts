import * as yup from "yup";

export const CreateRoleSchema = yup.object().shape({
  name: yup
    .string()
    .required("Role name name is required.")
    .min(3, "Role name must be at least 3 characters long.")
    .max(100, "Role name must not exceed 100 characters."),

  access: yup
    .array()
    .min(1, "At least one access permission is required.")
    .required("Access permission is required."),
});

export const UpdateRoleSchema = yup.object().shape({
  name: yup
    .string()
    .required("Role name name is required.")
    .min(3, "Role name must be at least 3 characters long.")
    .max(100, "Role name must not exceed 100 characters."),

  access: yup
    .array()
    .min(1, "At least one access permission is required.")
    .required("Access permission is required."),
});
