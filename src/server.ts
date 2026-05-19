import app from "./app";
import config from "./config";
import connectDatabase from "./config/db";

let server: any;

// Must be top-level
process.on("uncaughtException", (error: any) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

async function main() {
  try {
    await connectDatabase(config.db_url as string);
    console.log("Database connected 💪");

    const port = Number(config.port) || 5000;

    server = app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

    process.on("unhandledRejection", (error: any) => {
      console.error("Unhandled Rejection:", error);

      server.close(() => {
        process.exit(1);
      });
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully...");

      server.close(() => {
        console.log("Server shut down");
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();