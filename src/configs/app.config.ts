import { registerAs } from '@nestjs/config';
import { Environment } from '@Common';

export const appConfigFactory = registerAs('app', () => ({
  env: process.env.APP_ENV as Environment,
  domain: process.env.DOMAIN,
  appWebUrl: process.env.APP_WEB_URL,
  adminWebUrl: process.env.ADMIN_WEB_URL,
  serverUrl: process.env.SERVER_URL,
  appUri: process.env.APP_URI,
  httpPayloadMaxSize: '20mb',
  cacheTtl: 1,
  name: process.env.APP_NAME,
  shortName: process.env.APP_SHORT_NAME,
  adminPercent: Number(process.env.ADMIN_PERCENT || 10),
  managerPercent: Number(process.env.MANAGER_PERCENT || 90),
  platformFee: Number(process.env.platformFee || 2),
  maxTicketsPerDay: Number(process.env.MAX_TICKETS_PER_DAY || 5),
  holdMinutes: Number(process.env.HOLD_MINUTES || 10),
}));
