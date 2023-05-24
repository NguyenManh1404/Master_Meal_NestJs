import {Body, Controller, HttpCode, Post, Put, Request, UseGuards} from '@nestjs/common';
import {TokenResponse} from '../requests/admins/token.response';
import {
  ApiBearerAuth, ApiExcludeController,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {AuthAdminService} from '../services/auth-admin.service';
import {OpenApiResponseStatus422} from '../../common/dtos/validation.dto';
import {
  OpenApiResponseStatus204,
  OpenApiResponseStatus401,
} from '../../common/dtos/response-schema.dto';
import {ServerErrorResponseSchema} from '../../common/errors/server.error';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {UnauthenticatedResponseSchema} from '../../common/responses/unauthenticate.response';
import {
  ApiResponseStatus200,
  ApiResponseStatus200Schema,
  OpenApiResponseStatus200,
} from '../../common/responses/200.response';
import {ApiError} from '../../common/responses/common-error.response';
import {LoginRequest} from '../requests/users/login.request';

@Controller('auth-admin')
@ApiTags('Admin authentication')
@ApiInternalServerErrorResponse({
  description: 'Server error',
  type: ServerErrorResponseSchema,
})
@ApiExtraModels(TokenResponse)
@ApiExcludeController()
export class AuthAdminController {
  constructor(
    private readonly authAdminService: AuthAdminService,
  ) {
  }

  @Post('login')
  @ApiOperation({summary: 'Admin login'})
  @HttpCode(200)
  @OpenApiResponseStatus422()
  @OpenApiResponseStatus200(TokenResponse)
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
    type: UnauthenticatedResponseSchema,
  })
  public async login(
    @Body() credentials: LoginRequest
  ): Promise<ApiResponseStatus200Schema<TokenResponse> | ApiError> {
    const admin = await this.authAdminService.validateAdmin(
      credentials.email,
      credentials.password
    );
    if (!admin) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const accessToken = await this.authAdminService.createBearerToken(admin);
    return new ApiResponseStatus200('Login successfully', {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: Number(process.env.JWT_EXPIRATION),
    });
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({summary: 'Admin logout.'})
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Bearer')
  @OpenApiResponseStatus204()
  @OpenApiResponseStatus401()
  public async logout(@Request() req: any): Promise<any> {
    await this.authAdminService.revokeAllBearerTokens(req.user);
    return {
      message: 'Logout successfully.',
      status: 204,
    };
  }
}
