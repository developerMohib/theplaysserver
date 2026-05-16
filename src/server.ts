import mongoose from 'mongoose';
import app from './app';
import config from './config';
import connectDatabase from './config/db';

const startServer = (app: any, port: number | string) => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
};

async function main() {
  await connectDatabase(config.db_url as string);
  startServer(app, config.port as string);
}

main();