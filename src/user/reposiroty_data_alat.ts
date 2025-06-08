import prisma from "../config/db";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
export class UserRepository {
async createUser(data: {
    email: string,
    password: string, // sudah dalam bentuk hashed password
    first_name?: string,
    last_name?: string,
    phone?: string,
    image?: string,
    agency?: string,
    job?: string,
    address?: string,
    gender: boolean
}): Promise<User> {
    // Simpan user langsung tanpa hash ulang password
    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: data.password,
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            image: data.image,
            agency: data.agency,
            job: data.job,
            address: data.address,
            gender: data.gender
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
        // Hash password baru di sini
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });
    }
    async getUserProfile(email: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { email },
        select: {
            email: true,
            first_name: true,
            last_name: true,
            phone: true,
            image: true,
            agency: true,
            job: true,
            address: true,
            gender: true,
            // Optionally, add any other fields you want to retrieve for the profile
        }
    });
}
}
