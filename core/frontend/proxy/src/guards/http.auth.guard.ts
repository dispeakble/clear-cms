import {CanActivate, Injectable} from '@nestjs/common';


@Injectable()
export class HttpAuthGuard implements CanActivate {

    canActivate(): boolean {
        try {
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}