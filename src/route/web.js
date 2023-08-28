import express from "express";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
  // login
  router.post("/login", userController.handleLogin);
  router.post("/logout", userController.handleLogout);

  // CRUD user
  router.get("/get-all-users", userController.handleGetAllUsers);
  router.post("/create-new-user", userController.handleCreateNewUser);
  router.put("/edit-user", userController.handleEditUser);
  router.delete("/delete-user", userController.handleDeleteUser);

  return app.use("/api", router);
};

module.exports = initWebRoutes;
