declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT: string;
    DATABASE_URL: string;
    GOOGLE_SECRET: string;
    GOOGLE_ID: string;
    SECRET: string;
    ALLOWED_ORIGINS: string;
    // Add more variables as needed
  }
}
