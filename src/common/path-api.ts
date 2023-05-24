const API = "api";
const CLIENT = "http://localhost:4200/";

export const AUTH = {
  SEND_MAIL_FORGETPASS: "#/reset-password",
  CHANGE_PASSWORD: API + "/reset-password",
};

export class PathAPI {
  public static PATH_SEND_MAIL_FORGETPASS = CLIENT + AUTH.SEND_MAIL_FORGETPASS;
}
