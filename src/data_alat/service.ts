import { DataRepository } from "./repository";
import { Data } from "../generated/prisma";

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

        let time: Date;
        if (typeof data.time === "string") {
            const parsed = new Date(data.time);
            if (isNaN(parsed.getTime())) {
                throw new Error("Format time tidak valid");
            }
            time = parsed;
        } else if (data.time instanceof Date) {
            time = data.time;
        } else {
            throw new Error("Field time harus berupa Date atau string ISO");
        }

        if (data.volume !== undefined && typeof data.volume !== "number") {
            throw new Error("Field volume harus berupa number");
        }
        const savedData = await this.dataRepo.sendByUserId(user_id, {
            time,
            name: data.name ?? null,
            status: data.status ?? null,
            volume: data.volume ?? null,
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