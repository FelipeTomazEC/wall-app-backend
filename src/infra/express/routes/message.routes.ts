import { RequestHandler, Router } from 'express';

export type MessageHandlers = {
  postMessage: RequestHandler;
  getAll: RequestHandler;
};

export const getMessageRoutes = (handlers: MessageHandlers): Router => {
  const router = Router();
  router.post('/messages', handlers.postMessage);
  router.get('/messages', handlers.getAll);

  return router;
};
