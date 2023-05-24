import { Body, Controller, Get, HttpCode, HttpStatus, ParseFilePipeBuilder, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiResponseStatus200, ApiResponseStatus200Schema, OpenApiResponseStatus200 } from '../../common/responses/200.response';
import { OpenApiResponseStatus204, OpenApiResponseStatus401 } from '../../common/dtos/response-schema.dto';
import { OpenApiResponseStatus422 } from '../../common/dtos/validation.dto';
import { ProfileResponse } from '../responses/users/profile.response';
import { UserService } from '../services/user.service';
import { UpdateProfileRequest } from '../requests/users/update-profile.request';
import { AuthService } from '../services/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServerErrorResponseSchema } from '../../common/errors/server.error';

@Controller('account')
@ApiTags('Account')
@ApiInternalServerErrorResponse({description: 'Server error', type: ServerErrorResponseSchema})
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard)
export class AccountController {

  constructor(
    protected readonly userService: UserService,
    protected readonly authService: AuthService
  ) {
  }

  @Get('profile')
  @ApiOperation({summary: 'Get user profile by access token.'})
  @HttpCode(200)
  @OpenApiResponseStatus200(ProfileResponse)
  @OpenApiResponseStatus401()
  public async getProfile(
    @Request() req: any
  ): Promise<ApiResponseStatus200Schema<ProfileResponse>> {
    return new ApiResponseStatus200('Get profile successfully.', new ProfileResponse(req.user.attributes));
  }

  @Post('profile')
  @ApiOperation({summary: 'Update current user profile.'})
  @HttpCode(200)
  @OpenApiResponseStatus200(ProfileResponse)
  @OpenApiResponseStatus422()
  @OpenApiResponseStatus401()
  public async updateProfile(
    @Body() request: UpdateProfileRequest,
    @Request() req: any
  ): Promise<ApiResponseStatus200Schema<ProfileResponse>> {
    const user = await this.userService.update(req.user.attributes.id, request);
    return new ApiResponseStatus200('Get profile successfully.', new ProfileResponse(user));
  }

  @Post('avatar')
  @ApiOperation({summary: 'Update current user avatar.'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
      },
    },
  })
  @OpenApiResponseStatus200(ProfileResponse)
  @OpenApiResponseStatus422()
  @OpenApiResponseStatus401()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  public async changeAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({fileType: '(jpg|jpeg|png)$'})
        .addMaxSizeValidator({maxSize: 5242880})
        .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
    ) file: Express.Multer.File,
    @Request() req: any
  ): Promise<ApiResponseStatus200Schema<ProfileResponse>> {
    const currentUser = req.user.attributes;
    const user = await this.userService.changeAvatar(currentUser.id, file);
    return new ApiResponseStatus200('Get profile successfully.', new ProfileResponse(user));
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({summary: 'User logout.'})
  @OpenApiResponseStatus204()
  @OpenApiResponseStatus401()
  public async logout(
    @Request() req: any
  ): Promise<any> {
    await this.authService.revokeAllBearerTokens(req.user.attributes);
    return;
  }
}
