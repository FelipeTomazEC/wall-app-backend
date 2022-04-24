import { Express, json } from 'express';
import cors from 'cors';

export const setupMiddlewares = (application: Express) => {
  application.use(
    cors({
      origin: process.env.FRONT_END_ORIGIN,
    }),
  );
  application.use(json());
};
