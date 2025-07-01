import { Module } from "@nestjs/common";
import { UserEntity } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService]
})
export class UserModule {}
