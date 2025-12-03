import { sign } from "jsonwebtoken";
import { ApiError } from "../../utils/api.error";
import { comparePassword, hashPassword } from "../../utils/password";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { MailService } from "../mail/mail.servise";
import { ResetPasswordDto } from "./dto/reset-password.dto";

export class AuthService {
  prisma: PrismaService;
  mailService: MailService;

  constructor() {
    this.prisma = new PrismaService();
    this.mailService = new MailService();
  }

  register = async (body: RegisterDto) => {
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (user) throw new ApiError("email already exist!", 400);

    const hashedPassword = await hashPassword(body.password);

    await this.prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
      },
    });

    return { message: "register success" };
  };

  login = async (body: LoginDto) => {
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (!user) {
      throw new ApiError("invalid credentials", 400);
    }

    const isPasswordValid = await comparePassword(body.password, user.password);


    if (!isPasswordValid) {
      throw new ApiError("invalid credentials", 400);
    }
    const payload = { id: user.id }; 
    const accessToken = sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "2h",
    });

  
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, accessToken };
  };

  forgotPassword = async (body: ForgotPasswordDto) => {
 
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (!user) throw new ApiError("user not found", 404);


    const payload = { id: user.id }; 
    const accessToken = sign(payload, process.env.JWT_RESET!, {
      expiresIn: "15m",
    });

    await this.mailService.sendMail(
      user.email,
      "Forgot Password",
      "forgot-password",
      { link: `http://localhost:3000/reset-password?token=${accessToken}` }
    );

    return { message: "send email success" };
  };

  resetPassword = async (body: ResetPasswordDto, authUserId: number) => {
    const user = await this.prisma.user.findFirst({
      where: { id: authUserId },
    });

    if (!user) {
      throw new ApiError("user not found", 404);
    }

    const hashedPassword = await hashPassword(body.password);

    await this.prisma.user.update({
      where: { id: authUserId },
      data: { password: hashedPassword },
    });

    return { message: "reset password success" };
  };
}
