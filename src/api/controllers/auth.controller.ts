import {Body, Controller, HttpCode, Post, Put} from '@nestjs/common';
import {TokenResponse} from '../responses/users/token.response';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {AuthService} from '../services/auth.service';
import {OpenApiResponseStatus422} from '../../common/dtos/validation.dto';
import {ServerErrorResponseSchema} from '../../common/errors/server.error';
import {UserService} from '../services/user.service';
import {UnauthenticatedResponseSchema} from '../../common/responses/unauthenticate.response';
import {
  ApiResponseStatus200,
  ApiResponseStatus200Schema,
  OpenApiResponseStatus200
} from '../../common/responses/200.response';
import {MailService} from '../../mail/services/mail.service';
import {ApiError} from '../../common/responses/common-error.response';
import {LoginRequest} from '../requests/users/login.request';
import {ResetPasswordRequest} from '../requests/users/reset-password.request';
import {UpdatePasswordInput} from '../requests/users/update-password.input';
import {RegisterRequest} from '../requests/users/register.request';
import {ProfileResponse} from '../responses/users/profile.response';

@Controller('auth')
@ApiTags('Authentication')
@ApiInternalServerErrorResponse({description: 'Server error', type: ServerErrorResponseSchema})
@ApiExtraModels(TokenResponse)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) {
  }

  @Post('login')
  @ApiOperation({summary: 'User login'})
  @HttpCode(200)
  @OpenApiResponseStatus422()
  @OpenApiResponseStatus200(TokenResponse)
  @ApiUnauthorizedResponse({description: 'Invalid email or password', type: UnauthenticatedResponseSchema})
  public async login(
    @Body() credentials: LoginRequest
  ): Promise<ApiResponseStatus200Schema<TokenResponse> | ApiError> {
    const user = await this.authService.validateUser(credentials.email, credentials.password);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const accessToken = await this.authService.createBearerToken(user);
    return new ApiResponseStatus200('Login successfully', {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: Number(process.env.JWT_EXPIRATION),
    });
  }

  @Post('register')
  @HttpCode(200)
  @ApiOperation({summary: 'Register new account.'})
  @OpenApiResponseStatus200(ProfileResponse)
  @OpenApiResponseStatus422()
  public async register(
    @Body() request: RegisterRequest
  ): Promise<ApiResponseStatus200Schema<ProfileResponse>> {
    const newUser = await this.authService.registerUser(request);
    await this.mailService.sendUserConfirmation(newUser);
    return new ApiResponseStatus200('Registration successfully.', newUser);
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({summary: 'Request new password for user (forgot password).'})
  @OpenApiResponseStatus200()
  @OpenApiResponseStatus422()
  public async resetPassword(
    @Body() request: ResetPasswordRequest
  ): Promise<ApiResponseStatus200<boolean>> {
    const user = await this.userService.findBy({where: {email: request.email}});
    if (user) {
      await this.mailService.sendRequestNewPassword(user);
    }

    return new ApiResponseStatus200('Request successfully');
  }

  @Put('reset-password')
  @HttpCode(200)
  @ApiOperation({summary: 'Update new password using password reset token.'})
  @OpenApiResponseStatus200()
  @OpenApiResponseStatus422()
  public async updateNewPassword(
    @Body() request: UpdatePasswordInput
  ): Promise<any> {
    await this.authService.updatePasswordUsingToken(request);
    return new ApiResponseStatus200('Your password has been updated successfully.');
  }
}
