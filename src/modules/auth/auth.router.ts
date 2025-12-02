import { Router } from "express";
import { validateBody } from "../../middlewares/validation.middleware";
import { AuthController } from "./auth.controller";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";

export class AuthRouter {
  router: Router;
  authController: AuthController;
  jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.jwtMiddleware = new JwtMiddleware();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post(
      "/register",
      validateBody(RegisterDto),
      this.authController.register
    );
    this.router.post(
      "/login",
      validateBody(LoginDto),
      this.authController.login
    );
    this.router.post(
      "/forgot-password",
      validateBody(ForgotPasswordDto),
      this.authController.forgotPassword
    );
    this.router.patch(
      "/reset-password",
      this.jwtMiddleware.verifyToken(process.env.JWT_RESET!),
      validateBody(ResetPasswordDto),
      this.authController.resetPassword
    );
  };

  getRouter = () => {
    return this.router;
  };
}
