export const sendSuccess = async (
  req: any,
  res: any,
  data: any,
  message?: string,
  statusCode: number = 200
) => {
  req.moduleDescription = message;
  return res.status(statusCode).json({ data, message, status: "success" });
};

export const sendError = async (
  req: any,
  res: any,
  message: any,
  stateCode: number = 500,
  error?: any
) => {
  req.moduleDescription = error ? error?.message : message;
  return res
    .status(stateCode)
    .json({ message: message, status: "error", error });
};
