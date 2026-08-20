import toast, { Toaster, ToasterProps } from "react-hot-toast";
export const toastConfig: ToasterProps = {
  position: "bottom-right",
  gutter: 12,
  containerClassName: "",
  containerStyle: {},
  toastOptions: {
    // Default options for all types of toasts
    className: "font-sans font-medium",
    duration: 5000,
    style: {
      background: "var(--background)",
      color: "var(--foreground)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      padding: "0.75rem 1.25rem",
    },

    // Success toast
    success: {
      className: "border-success",
      style: {
        background: "hsl(143, 85%, 96%)",
        color: "hsl(140, 100%, 27%)",
        borderColor: "hsl(145, 92%, 91%)",
      },
      icon: "✅",
    },

    // Error toast
    error: {
      className: "border-error",
      style: {
        background: "hsl(359, 100%, 97%)",
        color: "hsl(360, 100%, 45%)",
        borderColor: "hsl(360, 100%, 94%)",
      },
      icon: "❌",
    },

    // Loading toast
    loading: {
      className: "border-muted",
      style: {
        background: "var(--background)",
        color: "var(--foreground)",
        borderColor: "var(--border)",
      },
    },

    // Custom toast for primary theme
    custom: {
      className: "border-primary",
      style: {
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        borderColor: "var(--primary)",
      },
    },
  },
};

// Component to render the Toaster with your config
export const CustomToaster = () => <Toaster {...toastConfig} />;

// Custom toast functions that match your theme
export const customToast = {
  success: (message: string) =>
    toast.success(message, toastConfig.toastOptions?.success),
  error: (message: string) =>
    toast.error(message, toastConfig.toastOptions?.error),
  loading: (message: string) =>
    toast.loading(message, toastConfig.toastOptions?.loading),
  primary: (message: string) =>
    toast(message, {
      ...toastConfig.toastOptions?.custom,
      style: {
        ...toastConfig.toastOptions?.custom?.style,
        background: "var(--primary)",
        color: "var(--primary-foreground)",
      },
    }),
  secondary: (message: string) =>
    toast(message, {
      ...toastConfig.toastOptions?.custom,
      style: {
        ...toastConfig.toastOptions?.custom?.style,
        background: "var(--secondary)",
        color: "var(--secondary-foreground)",
      },
    }),
  highlight: (message: string) =>
    toast(message, {
      ...toastConfig.toastOptions?.custom,
      style: {
        ...toastConfig.toastOptions?.custom?.style,
        background: "var(--highlight)",
        color: "var(--highlight-foreground)",
      },
    }),
};
