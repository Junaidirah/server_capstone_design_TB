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
exports.DataController = void 0;
const service_1 = require("./service");
class DataController {
    constructor() {
        this.dataService = new service_1.DataService();
    }
    sendByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = Number(req.params.userId) || Number(req.body.user_id);
                if (!user_id || isNaN(user_id)) {
                    res.status(400).json({ message: "User ID tidak valid" });
                    return;
                }
                const data = req.body;
                const savedData = yield this.dataService.sendByUserId(user_id, data);
                res.status(201).json(savedData);
            }
            catch (error) {
                res.status(400).json({ message: error.message || "Gagal menyimpan data" });
            }
        });
    }
    getByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = req.params.name;
                if (!name) {
                    res.status(400).json({ message: "Parameter nama wajib diisi" });
                    return;
                }
                const dataList = yield this.dataService.getByName(name);
                res.status(200).json(dataList);
            }
            catch (error) {
                res.status(400).json({ message: error.message || "Gagal mengambil data berdasarkan nama" });
            }
        });
    }
    getAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataList = yield this.dataService.getAll();
                res.status(200).json(dataList);
            }
            catch (error) {
                res.status(400).json({ message: error.message || "Gagal mengambil semua data" });
            }
        });
    }
}
exports.DataController = DataController;
