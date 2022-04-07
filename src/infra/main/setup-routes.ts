import { getUserRoutes } from "@infra/express/routes/user.routes"
import { makeUserHandlers } from "./make-user-handlers"
import { Express } from 'express';

export const setupRoutes = (application: Express) => {
  application.use(getUserRoutes(makeUserHandlers()));
}