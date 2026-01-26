import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    handleRequest(err, tenant, info) {
        if (err || !tenant) {
          throw new BadRequestException('نام کاربری یا رمز عبور نادرست است');
        }
        return tenant;
      }
}