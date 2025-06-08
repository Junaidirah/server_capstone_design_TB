import { Request, Response, RequestHandler } from "express";
import { UserService } from "./service";

// Define AuthRequest to have user data
interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Register user
  registerUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const result = await this.userService.registerUser(userData);
      res.status(201).json(result); // Modify response, do not return it
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Register failed" });
    }
  };

  // Login user
  loginUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.loginUser(email, password);
      res.status(200).json(result); // Modify response, do not return it
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  };

  // Logout user (frontend deletes token, backend just responds success)
  logoutUser: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: "Logout successful" }); // Modify response, do not return it
  };

  // Change password
  changePassword: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "User not authenticated" }); // Modify response, do not return it
        return;
      }

      const { oldPassword, newPassword } = req.body;
      const message = await this.userService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({ message }); // Modify response, do not return it
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Password change failed" });
    }
  };

  // Update user data
  updateUser: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "User not authenticated" }); // Modify response, do not return it
        return;
      }

      const data = req.body;
      const updatedUser = await this.userService.updateUser(userId, data);
      res.status(200).json({ message: "User data successfully updated", user: updatedUser }); // Modify response, do not return it
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Update data failed" });
    }
  };

  // Get user profile by email
  getUserProfileByEmail: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const email = req.user?.email;
      if (!email) {
        res.status(401).json({ message: "User not authenticated" }); // Modify response, do not return it
        return;
      }

      const userProfile = await this.userService.getUserProfileByEmail(email);
      if (!userProfile) {
        res.status(404).json({ message: "User profile not found" }); // Modify response, do not return it
        return;
      }

      res.status(200).json({ profile: userProfile }); // Modify response, do not return it
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to retrieve user profile" });
    }
  };
}
