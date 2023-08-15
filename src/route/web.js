import express from 'express';
// import { getHomePage } from '../controllers/homeController';
import userController from '../controllers/userController';

let router = express.Router();

let initWebRoutes = (app) => {
  // router.get('/', getHomePage);
  router.post('/api/login', userController.handleLogin);
  return app.use('/', router);
};

module.exports = initWebRoutes;
