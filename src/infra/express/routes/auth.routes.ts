import { RequestHandler, Router } from 'express';

export type AuthHandlers = {
  authenticate: RequestHandler;
}

export const getAuthRoutes = (handlers: AuthHandlers): Router => {
  const router = Router();
  router.post('/token', handlers.authenticate);

  return router;
}