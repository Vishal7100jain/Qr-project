const requiredEnvVars = [
  "NEXT_PRIVATE_BACKEND_URL",
  "NEXT_PUBLIC_BACKEND_IMAGE_URL",

  "NEXT_PUBLIC_APP_NAME",

  "NEXT_PUBLIC_BASE_URL",
  "NEXT_PRIVATE_BACKEND_API_KEY",
  "NEXT_PRIVATE_BACKEND_API_SECRET",

  "NEXT_PRIVATE_ENCRPTION_KEY",

  "NEXT_PRIVATE_COOKIE_TOKEN_EXPIRY",
  "NEXT_PRIVATE_SERVER_COOKIE_ADMIN_EXPIRY",
] as const;

// Check for missing variables
const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `❌ Missing required environment variables in .env.local: ${missing.join(
      ", "
    )}`
  );
}

export const envConfig = {
  apiUrl: process.env.NEXT_PRIVATE_BACKEND_URL!,

  // Public (browser-safe) env vars
  public: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
    appName: process.env.NEXT_PUBLIC_APP_NAME!,
  },

  apiKey: process.env.NEXT_PRIVATE_BACKEND_API_KEY!,
  apiSecret: process.env.NEXT_PRIVATE_BACKEND_API_SECRET!,

  nextAuthSecret: process.env.NEXT_PUBLIC_AUTH_SECRET!,

  encryptionKey: process.env.NEXT_PRIVATE_ENCRPTION_KEY!,

  serverCookie: {
    adminExpiry: Number(process.env.NEXT_PRIVATE_SERVER_COOKIE_ADMIN_EXPIRY!),
    tokenExpiry: Number(process.env.NEXT_PRIVATE_COOKIE_TOKEN_EXPIRY!),
  },
};
