import Logger from 'bunyan';
import bunyanLogger from '@root/config/logger/bunyanLogger';
import mongoose, { Mongoose } from 'mongoose';
import { config } from '@root/config/env/config';

const log: Logger = bunyanLogger('mongodb-connection');

async function connectToMongoDB(): Promise<void> {
  try {
    const dbConnection: Mongoose = await mongoose.connect(config.MONGO_URL);
    log.info('Successfully connected to MongoDB.');

    // Listen to connection events
    dbConnection.connection.on('error', handleMongoError);
    dbConnection.connection.on('disconnected', handleDisconnect);
    dbConnection.connection.on('reconnected', handleReconnect);
  } catch (error) {
    log.error('Error connecting to database', error);
    throw error;
  }
}

function handleMongoError(error: Error): void {
  log.error('Mongoose connection error:', error);
}

async function handleDisconnect(): Promise<void> {
  log.info('Mongoose disconnected from database. Reconnecting...');
  await connectToMongoDB();
}

function handleReconnect(): void {
  log.info('Mongoose reconnected to database.');
}

export default connectToMongoDB;
