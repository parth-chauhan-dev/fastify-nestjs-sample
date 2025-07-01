import { UserModule } from "src/users/user.module";
import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}