"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../user/controller");
const auth_1 = require("../middleware/auth");
const express_1 = require("express");
const controller_2 = require("../data_alat/controller");
const router = (0, express_1.Router)();
const userCtrl = new controller_1.UserController();
const dataCtrl = new controller_2.DataController();
router.get("/health", (_req, res) => {
    res.send("Server is healthy");
});
// Route User
router.post("/register", userCtrl.registerUser);
router.post("/login", userCtrl.loginUser);
router.post("/logout", auth_1.authenticate, userCtrl.logoutUser);
router.post("/change-password", auth_1.authenticate, userCtrl.changePassword);
router.put("/update", auth_1.authenticate, userCtrl.updateUser);
// ROUTE ALAT
router.post("/data/user/:userId", dataCtrl.sendByUserId);
router.get("/data/name/:name", dataCtrl.getByName);
router.get("/data/all", dataCtrl.getAll);
exports.default = router;
