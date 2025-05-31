import { Request, Response } from "express";
import { UserService } from "./service";

interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    // Register user
    registerUser = async (req: Request, res: Response) => {
        try {
            const userData = req.body;
            const result = await this.userService.registerUser(userData);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Register gagal" });
        }
    };

    // Login user
    loginUser = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const result = await this.userService.loginUser(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Login gagal" });
        }
    };

    // Logout user (biasanya frontend hapus token, backend bisa hanya respon success)
    logoutUser = async (_req: Request, res: Response) => {
        // Jika mau handle blacklist token, bisa ditambah di sini
        res.status(200).json({ message: "Logout berhasil" });
    };

    // Change password
    changePassword = async (req: AuthRequest, res: Response) => {
        try {
            // Asumsikan userId diambil dari middleware autentikasi dan disimpan di req.user
            const userId = (req as any).user.userId;
            const { oldPassword, newPassword } = req.body;
            const message = await this.userService.changePassword(userId, oldPassword, newPassword);
            res.status(200).json({ message });
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Ganti password gagal" });
        }
    };

    // Update data user
    updateUser = async (req: AuthRequest, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const data = req.body;
            const updatedUser = await this.userService.updateUser(userId, data);
            res.status(200).json({ message: "Data user berhasil diupdate", user: updatedUser });
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Update data gagal" });
        }
    };
}