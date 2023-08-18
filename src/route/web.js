import express from 'express';
// import { getHomePage } from '../controllers/homeController';
import userController from '../controllers/userController';

let router = express.Router();

let initWebRoutes = (app) => {
  // router.get('/', getHomePage);
  router.post('/api/login', userController.handleLogin);
  router.get('/api/get-all-users', userController.handleGetAllUsers);
  return app.use('/', router);
};

module.exports = initWebRoutes;
