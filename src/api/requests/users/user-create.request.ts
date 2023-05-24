import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsEmail,
} from "class-validator";
import { IsEqualTo } from "../../../common/validators/is-equal-to";
import { IsUnique } from "../../../common/validators/is-unique";
import UserModel from "../../../database/models/user.model";
import { UserUpdateRequest } from "./user-update.request";

export class UserCreateRequest extends UserUpdateRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(191)
  @IsUnique({
    entityClass: UserModel,
    columnName: "email",
  })
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(191)
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Your password is too weak.",
  })
  public password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEqualTo<UserCreateRequest>("password")
  public password_confirmation: string;
}
