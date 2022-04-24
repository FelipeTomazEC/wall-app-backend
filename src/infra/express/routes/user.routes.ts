import { RequestHandler, Router } from 'express';

export type UserHandlers = {
  register: RequestHandler;
};

export const getUserRoutes = (handlers: UserHandlers): Router => {
  const router = Router();
  router.post('/users', handlers.register);

  return router;
};
