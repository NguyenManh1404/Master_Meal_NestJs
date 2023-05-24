import { ApiProperty } from "@nestjs/swagger";
import UserModel from "../../../database/models/user.model";
import * as moment from "moment";

export class ProfileResponse {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public email: string;

  @ApiProperty({
    default: "2000-01-01",
  })
  public date_of_birth?: string;

  @ApiProperty()
  public avatar_url: string;

  @ApiProperty()
  public gender: string;

  constructor(userModel: UserModel) {
    this.id = userModel.id;
    this.name = userModel.name;
    this.email = userModel.email;
    this.gender = userModel.gender;
    this.date_of_birth = userModel.date_of_birth
      ? moment(userModel.date_of_birth).format("YYYY-MM-DD")
      : null;
  }
}
