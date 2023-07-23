import express from 'express';
import { getHomePage } from '../controllers/homeController';
let router = express.Router();

let initWebRoutes = (app) => {
  router.get('/', getHomePage);

  return app.use('/', router);
};

export default initWebRoutes;
