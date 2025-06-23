import { registerAs } from '@nestjs/config';

export default registerAs('main', () => ({
  GCP_URL: process.env.GCP_URL,
  API_KEY: process.env.API_KEY,
  API_PRIVATE: process.env.API_PRIVATE,
  FRONTEND_URL: process.env.FRONTEND_URL,
}));