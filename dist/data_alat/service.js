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
exports.DataService = void 0;
const repository_1 = require("./repository");
class DataService {
    constructor() {
        this.dataRepo = new repository_1.DataRepository();
    }
    sendByUserId(user_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_id || user_id <= 0) {
                throw new Error("User ID tidak valid");
            }
            if (!data.time) {
                throw new Error("Field time wajib diisi");
            }
            // Destructuring data input
            const { time: rawTime, name, status, volume } = data;
            // Parsing time
            let time;
            if (typeof rawTime === "string") {
                const parsed = new Date(rawTime);
                if (isNaN(parsed.getTime())) {
                    throw new Error("Format time tidak valid");
                }
                time = parsed;
            }
            else if (rawTime instanceof Date) {
                time = rawTime;
            }
            else {
                throw new Error("Field time harus berupa Date atau string ISO");
            }
            // Validasi volume
            if (volume !== undefined) {
                if (typeof volume !== "number") {
                    throw new Error("Field volume harus berupa number");
                }
                if (volume < 0) {
                    throw new Error("Field volume tidak boleh negatif");
                }
            }
            // Validasi name dan status (optional)
            const cleanName = name && name.trim() !== "" ? name : null;
            const cleanStatus = status && status.trim() !== "" ? status : null;
            const savedData = yield this.dataRepo.sendByUserId(user_id, {
                time,
                name: cleanName,
                status: cleanStatus,
                volume: volume !== null && volume !== void 0 ? volume : null,
            });
            return savedData;
        });
    }
    getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name || name.trim() === "")
                throw new Error("Parameter name wajib diisi");
            return yield this.dataRepo.getByName(name);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataRepo.getAll();
        });
    }
}
exports.DataService = DataService;
