import { Client } from 'pg'
import dotenv from 'dotenv';

dotenv.config();


const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'gemini',
  password: process.env.POSTGRESQL_PASSWORD,
  port: 5432
})

export const dbConnection = async () => {
  try {
    await client.connect();
    console.log('PostgreSQL connected ');
  } catch (err) {
    console.error('PostgreSQL connection error :', err);
  }
};

export default client;
  
 