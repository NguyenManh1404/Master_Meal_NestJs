import { ApiProperty } from "@nestjs/swagger";
import UserModel from "../../../database/models/user.model";
import * as moment from "moment";
import { DefaultFormat } from "../../../common/constants/format.const";

export class UserResponse {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public avatar_url: string;

  @ApiProperty()
  public date_of_birth: string;

  @ApiProperty()
  public gender: number;

  @ApiProperty()
  public failed_attempts: number;

  @ApiProperty()
  public activated_at: string;

  @ApiProperty()
  public locked_at?: string | null;

  @ApiProperty()
  public created_at?: string | null;

  constructor(user: UserModel) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    // this.gender = user.gender;
    this.date_of_birth = !user.date_of_birth
      ? null
      : moment(user.date_of_birth).format(DefaultFormat.DATE);
    this.created_at = !user.created_at
      ? null
      : moment(user.created_at).format(DefaultFormat.DATETIME);
  }
}
