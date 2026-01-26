import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../common/enums/enums';

export class UserDto {
  @ApiProperty({ enum: Gender })
  gender: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  nationalCode?: string;
}

export class UserAvatarDto {
  @ApiProperty()
  path: string;
}
