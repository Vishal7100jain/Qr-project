import bcrypt from "bcrypt";

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = 12;
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const decryptPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  const isPasswordCorrect: boolean = await bcrypt.compare(
    password,
    hashPassword
  );
  return isPasswordCorrect;
};
