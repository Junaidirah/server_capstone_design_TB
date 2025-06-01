// IMPORT DEPEDENCY
import { UserRepository } from "./reposiroty_data_alat";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "";
if (!SECRET) throw new Error("JWT_SECRET environment variable is not defined!");

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async registerUser(data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    image?: string;
    agency?: string;
    job?: string;
    address?: string;
    gender: boolean;
  }): Promise<{ user: Partial<User>; message: string }> {
    const exist = await this.userRepo.getUserByEmail(data.email);
    if (exist) throw new Error("Email sudah terdaftar");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData = { ...data, password: hashedPassword };

    const user = await this.userRepo.createUser(userData);
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, message: "User berhasil didaftarkan" };
  }

  async loginUser(email: string, password: string): Promise<{ token: string; message: string }> {
    const user = await this.userRepo.getUserByEmail(email);
    if (!user) throw new Error("Email tidak ditemukan");

    const match = await bcrypt.compare(password, user.password ?? "");
    if (!match) throw new Error("Password salah");

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, { expiresIn: "1d" });
    return { token, message: "Login berhasil" };
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<string> {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new Error("User tidak ditemukan");

    const match = await bcrypt.compare(oldPassword, user.password ?? "");
    if (!match) throw new Error("Password lama salah");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.changePassword(userId, hashedNewPassword);
    return "Password berhasil diubah";
  }

  async updateUser(
    userId: number,
    data: Partial<Omit<User, "id" | "password" | "email">>
  ): Promise<Partial<User>> {
    const updatedUser = await this.userRepo.updateUser(userId, data);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}