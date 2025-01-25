import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class IdNumberReq {
  @ApiProperty()
  @IsNumber()
  id: number;
}
export class UUIDReq {
  @ApiProperty()
  @IsUUID('4')
  id: string;
}
export class EmptyPageResponse {
  data = [];
  @ApiProperty()
  total = 0;
}

export class AddressReq {
  @ApiProperty()
  address: string;
}

export class MultipartFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export class FileRes {
  @ApiProperty()
  fileName: string;
  @ApiProperty()
  originalname: string;
  @ApiProperty()
  mimetype: string;
  @ApiProperty()
  size: number;
  @ApiProperty()
  cndUrl: string;
  @ApiProperty()
  fullUrl: string;
}
