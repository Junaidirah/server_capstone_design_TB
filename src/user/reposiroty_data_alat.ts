import prisma from "../config/db";
import { User } from "@prisma/client";
import bcrypt from 'bcryptjs';

export class UserRepository {
    async createUser(data: {
        email: string,
        password: string,
        first_name?: string,
        last_name?: string,
        phone?: string,
        image?: string,
        agency?: string,
        job?: string,
        address?: string,
        gender: boolean
    }): Promise<User> {
        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword
            }
        });
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async getUserById(id: number): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async updateUser(id: number, data: Partial<Omit<User, "id" | "password">>): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async changePassword(id: number, newPassword: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });
    }
}
