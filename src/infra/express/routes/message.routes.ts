import { RequestHandler, Router } from "express"

export type MessageHandlers = {
  postMessage: RequestHandler;
}

export const getMessageRoutes = (handlers: MessageHandlers): Router => {
  const router = Router();
  router.post('/messages', handlers.postMessage);

  return router;
}