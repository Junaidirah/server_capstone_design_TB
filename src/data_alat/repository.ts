import prisma from "../config/db";
import { Data } from "../generated/prisma";

export class DataRepository {
	async sendByUserId(user_id: number, data: Omit<Data, "id" | "user_id">): Promise<Data> {
		return await prisma.data.create({
			data: {
				...data,
				user_id,
			},
		});
	}
	async getByName(name: string): Promise<Data[]> {
		return await prisma.data.findMany({
			where: { name },
		});
	}
	async getAll(): Promise<Data[]> {
		return await prisma.data.findMany();
	}
}