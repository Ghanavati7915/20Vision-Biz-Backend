import {
  Controller,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  MaxFileSizeValidator,
  ParseFilePipe,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@ApiBearerAuth('JWT-auth')
@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  //#region Upload
  @Post(':folderName')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('folderName') folderName: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 20 * 1000 }), // max file size is 20 mb
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.upload(folderName, file);
  }
  //#endregion
}
