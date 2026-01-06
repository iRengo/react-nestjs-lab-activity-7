import {Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import {UsersService} from '../users/users.service';
import {LoginDto} from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {sub: user.userId, email: user.email, role: user.role};
    const accessToken = await this.jwtService.signAsync(payload);

    const {password, ...safeUser} = user;

    return {
      accessToken,
      user: safeUser,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersService.findOneByEmail(normalizedEmail);

    if (!user) {
      throw new NotFoundException('No account found for the provided email address.');
    }

    const newPassword = this.generateSecurePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.updatePassword(user.userId, hashedPassword);

    try {
      await this.sendResetEmail({
        recipient: user.email,
        tempPassword: newPassword,
        displayName: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'TaskRush user',
      });
    } catch (error) {
      throw new InternalServerErrorException('Password reset email could not be sent. Please try again later.');
    }
  }

  private async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  private generateSecurePassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    const requiredCharacters = [
      this.getRandomCharacter(uppercase),
      this.getRandomCharacter(lowercase),
      this.getRandomCharacter(digits),
      this.getRandomCharacter(symbols),
    ];

    const allCharacters = uppercase + lowercase + digits + symbols;
    const targetLength = 12;

    while (requiredCharacters.length < targetLength) {
      requiredCharacters.push(this.getRandomCharacter(allCharacters));
    }

    for (let index = requiredCharacters.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [requiredCharacters[index], requiredCharacters[randomIndex]] = [
        requiredCharacters[randomIndex],
        requiredCharacters[index],
      ];
    }

    return requiredCharacters.join('');
  }

  private getRandomCharacter(source: string): string {
    const position = Math.floor(Math.random() * source.length);
    return source[position];
  }

  private async sendResetEmail({
    recipient,
    tempPassword,
    displayName,
  }: {
    recipient: string;
    tempPassword: string;
    displayName: string;
  }): Promise<void> {
    const host = process.env.EMAIL_HOST;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587;
    const secure = process.env.EMAIL_SECURE === 'true';

    if (!host || !user || !pass) {
      throw new InternalServerErrorException('Email service is not configured.');
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const fromAddress = process.env.EMAIL_FROM || `TaskRush <${user}>`;

    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: 'TaskRush Password Reset',
      text: `Hello ${displayName},

Your password has been reset. Use the temporary password below to sign in and update it immediately:

${tempPassword}

If you did not request this change, please contact the TaskRush administrator right away.

— TaskRush Team`,
      html: `
        <p>Hello ${displayName},</p>
        <p>Your password has been reset. Use the temporary password below to sign in and update it immediately:</p>
        <p style="font-size: 16px; font-weight: bold;">${tempPassword}</p>
        <p>If you did not request this change, please contact the TaskRush administrator right away.</p>
        <p>— TaskRush Team</p>
      `,
    });
  }
}
