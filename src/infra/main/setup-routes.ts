import { getUserRoutes } from "@infra/express/routes/user.routes"
import { makeUserHandlers } from "./make-user-handlers"
import { Express } from 'express';
import { getAuthRoutes } from "@infra/express/routes/auth.routes";
import { makeAuthHandlers } from "./make-auth-handlers";

export const setupRoutes = (application: Express) => {
  application.use(getUserRoutes(makeUserHandlers()));
  application.use(getAuthRoutes(makeAuthHandlers()));
}