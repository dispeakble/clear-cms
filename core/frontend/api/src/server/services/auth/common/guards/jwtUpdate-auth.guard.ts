import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtUpdateAuthGuard extends AuthGuard('jwt-update') {}
