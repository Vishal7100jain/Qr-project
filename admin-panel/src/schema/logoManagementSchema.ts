import * as Yup from "yup";

export const CreateLogoSchema = Yup.object().shape({
  sk: Yup.string().required("Stock/Symbol name is required"),
  xc: Yup.string()
    .required("Exchange is required.")
    .oneOf(
      ["NSE", "BSE", "MCX", "NCO"],
      "Exchange must be either NSE, BSE, MCX, NCO"
    ),
  logoUrl: Yup.string().url("Enter a valid URL").nullable(),
});
