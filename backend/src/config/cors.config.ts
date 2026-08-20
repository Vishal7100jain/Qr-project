import cors from "cors";

const allowedOrigins = [
  "http://localhost:3000", // Your frontend URL
  // Add other allowed origins as needed
];

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-API-KEY",
    "X-API-SECRET",
    "X-Requested-With",
  ],
  credentials: true,
};

export default cors(corsOptions);
