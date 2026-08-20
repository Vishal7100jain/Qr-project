"use client";
import { HandleLoginAction } from "@/action/admin/adminAuth.Action";
import { SignInSchema } from "@/schema/adminAuthSchema";
import { useAdminStore } from "@/zustand/admin.store";
import { FormikProvider, useFormik } from "formik";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { customToast } from "../customToast";
import InputField from "../form/input/InputField";
import { Loader } from "../ui/loader";

const initialValues = {
  email: "",
  password: "",
};

export default function SignInForm() {
  const admin = useAdminStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema: SignInSchema,
    onSubmit: (values) => handleLogin(values),
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await HandleLoginAction(values);
      if (response?.status === "success") {
        // @ts-ignore
        useAdminStore.getState().setAdmin(response?.data);
        customToast.success(response?.message);
        router.push("/");
      } else if (response?.status === "error") {
        customToast.error(response?.message);
        formik.setErrors(response?.message);
      }
    } catch (error: any) {
      customToast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormikProvider value={formik}>
      <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and password to sign in!
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5 relative">
              <InputField
                icon={<Mail />}
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                maxLength={55}
                formik={formik}
              />

              <InputField
                label="Password"
                name="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                maxLength={20}
                formik={formik}
                icon={<Lock />}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-40"
              >
                {showPassword ? (
                  <Eye className="dark:text-gray-400" />
                ) : (
                  <EyeOff className="dark:text-gray-400" />
                )}
              </span>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  {!isLoading ? "Sign In" : <Loader className="bg-brand-500" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormikProvider>
  );
}
