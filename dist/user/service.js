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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// IMPORT DEPEDENCY
const reposiroty_data_alat_1 = require("./reposiroty_data_alat");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || "";
if (!SECRET)
    throw new Error("JWT_SECRET environment variable is not defined!");
class UserService {
    constructor() {
        this.userRepo = new reposiroty_data_alat_1.UserRepository();
    }
    registerUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.userRepo.getUserByEmail(data.email);
            if (exist)
                throw new Error("Email sudah terdaftar");
            const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
            const userData = Object.assign(Object.assign({}, data), { password: hashedPassword });
            const user = yield this.userRepo.createUser(userData);
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return { user: userWithoutPassword, message: "User berhasil didaftarkan" };
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this.userRepo.getUserByEmail(email);
            if (!user)
                throw new Error("Email tidak ditemukan");
            const match = yield bcryptjs_1.default.compare(password, (_a = user.password) !== null && _a !== void 0 ? _a : "");
            if (!match)
                throw new Error("Password salah");
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, SECRET, { expiresIn: "1d" });
            return { token, message: "Login berhasil" };
        });
    }
    changePassword(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this.userRepo.getUserById(userId);
            if (!user)
                throw new Error("User tidak ditemukan");
            const match = yield bcryptjs_1.default.compare(oldPassword, (_a = user.password) !== null && _a !== void 0 ? _a : "");
            if (!match)
                throw new Error("Password lama salah");
            const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            yield this.userRepo.changePassword(userId, hashedNewPassword);
            return "Password berhasil diubah";
        });
    }
    updateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.userRepo.updateUser(userId, data);
            const { password } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
            return userWithoutPassword;
        });
    }
}
exports.UserService = UserService;
