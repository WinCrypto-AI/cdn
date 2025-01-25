import { Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { DefController, DefPost } from '~/@core/decorator';
import { FileStorageService } from '../services';
import { MultipartFile } from '~/dto/common.dto';
import { Request } from 'express';

@DefController('')
export class ResourceController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @DefPost('/upload')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: MultipartFile[], @Req() req: Request) {
    const domain = `${req.protocol}://${req.headers.host}`;
    return this.fileStorageService.storeFile(files[0], domain);
  }
}
