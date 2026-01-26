import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import path from 'path';
import * as fs from 'fs';
import { imageExtensionRegex } from 'src/common/regex/regex';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) { }
  async upload(folderName, file: Express.Multer.File) {
    try {
      const validation: RegExp = imageExtensionRegex;

      this.validateFileExtension(
        validation,
        `.${this.getFileExtension(file.originalname)}`,
      );

      const uploadPath: string = `${process.env.INTERNAL_UPLOAD_ADDRESS}/${folderName}`;

      this.checkPathExistsOrCreate(uploadPath);

      const modifiedFileName = `${this.getFileNameWithoutExtension(file.originalname)}-${Date.now()}.${this.getFileExtension(file.originalname)}`;

      fs.writeFileSync(`${uploadPath}/${modifiedFileName}`, file.buffer);

      return {
        path: `${folderName}/${modifiedFileName}`,
        fullPath: `${process.env.BACKEND_DOMAIN}/dl/${folderName}/${modifiedFileName}`,
      };
    } catch (error: any) {
      console.log('error : ', error)
      if (error instanceof BadRequestException) throw error;
      throw new GoneException('آپلود با خطا مواجه شد');
    }
  }

  //#region Helpers
  getFileNameWithoutExtension(fileName: string): string {
    return fileName.slice(0, fileName.lastIndexOf('.'));
  }

  getFileExtension(fileName: string): any {
    return fileName.split('.').pop();
  }

  checkPathExistsOrCreate(path: string) {
    if (!fs.existsSync(path)) fs.mkdirSync(path);
  }

  validateFileExtension(regex: RegExp, fileExtension: string) {
    if (!regex.test(fileExtension))
      throw new BadRequestException('فایل را با فرمت صحیح وارد کنید');
  }
  //#endregion
}
