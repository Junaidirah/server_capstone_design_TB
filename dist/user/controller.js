"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const service_1 = require("./service");
class UserController {
    constructor() {
        // Register user
        this.registerUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const result = yield this.userService.registerUser(userData);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message || "Register gagal" });
            }
        });
        // Login user
        this.loginUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.userService.loginUser(email, password);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message || "Login gagal" });
            }
        });
        // Logout user (biasanya frontend hapus token, backend bisa hanya respon success)
        this.logoutUser = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            // Jika mau handle blacklist token, bisa ditambah di sini
            res.status(200).json({ message: "Logout berhasil" });
        });
        // Change password
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Asumsikan userId diambil dari middleware autentikasi dan disimpan di req.user
                const userId = req.user.userId;
                const { oldPassword, newPassword } = req.body;
                const message = yield this.userService.changePassword(userId, oldPassword, newPassword);
                res.status(200).json({ message });
            }
            catch (error) {
                res.status(400).json({ message: error.message || "Ganti password gagal" });
            }
        });
        // Update data user
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const data = req.body;
                const updatedUser = yield this.userService.updateUser(userId, data);
                res.status(200).json({ message: "Data user berhasil diupdate", user: updatedUser });
            }
            catch (error) {
                res.status(400).json({ message: error.message || "Update data gagal" });
            }
        });
        this.userService = new service_1.UserService();
    }
}
exports.UserController = UserController;
