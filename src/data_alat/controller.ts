import { Request, Response } from "express";
import { DataService } from "./service";

export class DataController {
  private dataService: DataService;

  constructor() {
    this.dataService = new DataService();
  }

  async sendByUserId(req: Request, res: Response): Promise<void> {
    try {
      const user_id = Number(req.params.userId) || Number(req.body.user_id);
      if (!user_id || isNaN(user_id)) {
        res.status(400).json({ message: "User ID tidak valid" });
        return;
      }
      const data = req.body;
      const savedData = await this.dataService.sendByUserId(user_id, data);
      res.status(201).json(savedData);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Gagal menyimpan data" });
    }
  }

  async getByName(req: Request, res: Response): Promise<void> {
    try {
      const name = req.params.name;
      if (!name) {
        res.status(400).json({ message: "Parameter nama wajib diisi" });
        return;
      }
      const dataList = await this.dataService.getByName(name);
      res.status(200).json(dataList);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Gagal mengambil data berdasarkan nama" });
    }
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const dataList = await this.dataService.getAll();
      res.status(200).json(dataList);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Gagal mengambil semua data" });
    }
  }
}

