import { DataRepository } from "./repository";
import { Data } from "@prisma/client";

interface SendDataInput {
    time: Date | string;
    name?: string;
    status?: string;
    volume?: number;
}

export class DataService {
  private dataRepo: DataRepository;

  constructor() {
    this.dataRepo = new DataRepository();
  }

  async sendByUserId(user_id: number, data: SendDataInput): Promise<Data> {
    if (!user_id || user_id <= 0) {
      throw new Error("User ID tidak valid");
    }
    if (!data.time) {
      throw new Error("Field time wajib diisi");
    }

    // Destructuring data input
    const { time: rawTime, name, status, volume } = data;

    // Parsing time
    let time: Date;
    if (typeof rawTime === "string") {
      const parsed = new Date(rawTime);
      if (isNaN(parsed.getTime())) {
        throw new Error("Format time tidak valid");
      }
      time = parsed;
    } else if (rawTime instanceof Date) {
      time = rawTime;
    } else {
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

    const savedData = await this.dataRepo.sendByUserId(user_id, {
      time,
      name: cleanName,
      status: cleanStatus,
      volume: volume ?? null,
    });

    return savedData;
  }

  async getByName(name: string): Promise<Data[]> {
    if (!name || name.trim() === "") throw new Error("Parameter name wajib diisi");
    return await this.dataRepo.getByName(name);
  }

  async getAll(): Promise<Data[]> {
    return await this.dataRepo.getAll();
  }
}
