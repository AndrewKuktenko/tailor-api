import { IsString } from 'class-validator';

export class S3ImportDto {
  @IsString()
  key: string;
}
