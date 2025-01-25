import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFile } from 'fs';
import * as uuid from 'uuid';
import { configEnv } from '~/@config/env';
import { GlobalPrefix } from '~/common/constants';
import { MultipartFile, FileRes } from '~/dto/common.dto';

const { DIR_RESOURCE, STATIC_PATH_FILES } = configEnv();

@Injectable()
export class FileStorageService {
  async saveFile(file: MultipartFile, domain: string): Promise<FileRes> {
    const makeFileName = (uuid.v4() + file.originalname).replace(/[-_]/g, '').replace(/\s/g, '_');
    return new Promise((resolve, reject) => {
      writeFile(DIR_RESOURCE + makeFileName, file.buffer, (err: NodeJS.ErrnoException | null) => {
        if (err) {
          reject(err.message);
        } else {
          const fileRes = new FileRes();
          fileRes.fileName = makeFileName;
          fileRes.size = file.size;
          fileRes.mimetype = file.mimetype;
          fileRes.originalname = file.originalname;
          fileRes.fullUrl = `${domain}/${STATIC_PATH_FILES}/${makeFileName}`;
          resolve(fileRes);
        }
      });
    });
  }

  storeFile(file: MultipartFile, domain: string) {
    if (!existsSync(DIR_RESOURCE)) {
      mkdirSync(DIR_RESOURCE, {
        recursive: true,
      });
    }
    return this.saveFile(file, domain);
  }

  async storeFiles(files: MultipartFile[], domain: string) {
    const result: FileRes[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await this.storeFile(file, domain);
      result.push(res);
    }
    return result;
  }
}
