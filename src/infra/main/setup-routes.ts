import { getUserRoutes } from "@infra/express/routes/user.routes"
import { makeUserHandlers } from "./make-user-handlers"
import { Express } from 'express';
import { getAuthRoutes } from "@infra/express/routes/auth.routes";
import { makeAuthHandlers } from "./make-auth-handlers";
import { getMessageRoutes } from "@infra/express/routes/message.routes";
import { makeMessageHandlers } from "./make-message-handlers";

export const setupRoutes = (application: Express) => {
  application.use(getUserRoutes(makeUserHandlers()));
  application.use(getAuthRoutes(makeAuthHandlers()));
  application.use(getMessageRoutes(makeMessageHandlers()));
}