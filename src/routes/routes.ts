import { UserController } from "../user/controller";
import { authenticate } from "../middleware/auth";
import { Router } from "express";
import { DataController } from "../data_alat/controller";

const router = Router();
const userCtrl = new UserController();
const dataCtrl = new DataController();

router.get("/health", (_req, res) => {
  res.send("Server is healthy");
});
// Route User
router.post("/register", userCtrl.registerUser);
router.post("/login", userCtrl.loginUser);
router.post("/logout", authenticate, userCtrl.logoutUser);
router.post("/change-password", authenticate, userCtrl.changePassword);
router.put("/update", authenticate, userCtrl.updateUser);
// ROUTE ALAT
router.post("/data/user/:userId", dataCtrl.sendByUserId);
router.get("/data/name/:name", dataCtrl.getByName);
router.get("/data/all", dataCtrl.getAll);

export default router;
