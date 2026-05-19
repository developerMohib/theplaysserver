
import app from './app';
import config from './config';
import connectDatabase from './config/db';

const startServer = (app: any, port: number | string) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });

  return server;
};

async function main() {
  try {
    await connectDatabase(config.db_url as string);
    console.log('Database connected 💪');

    const server = startServer(app, config.port as string);

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (error: any) => {
      console.error('Unhandled Rejection:', error);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: any) => {
      console.error('Uncaught Exception:', error);
      server.close(() => {
        process.exit(1); // PM2 will auto-restart
      });
    });

    // Graceful shutdown on SIGTERM (for PM2)
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server shut down');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit so PM2 can restart
  }
}

main();