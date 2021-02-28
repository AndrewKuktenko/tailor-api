import { IsString, IsEnum } from 'class-validator';

export class CreateImportDto {
  @IsString()
  name: string;

  @IsString()
  dataFileUrl: string;

  @IsString()
  @IsEnum(['patient', 'hospital'])
  source: string;

  @IsEnum(['file'])
  type: string;
}
