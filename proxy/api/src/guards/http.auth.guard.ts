import {CanActivate, ExecutionContext, HttpStatus, Injectable} from '@nestjs/common';


@Injectable()
export class HttpAuthGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean {
        try {
            const req = context.switchToHttp().getRequest();

            if (req.url === '/') {
                if (req.session && req.session.user) {
                    return true;
                } else {
                    const response = context.switchToHttp().getResponse();
                    response.redirect('/view-auth') //TODO GET THIS REDIRECT FROM SOMEWHERE ELSE
                }

            } else {
                return true;
            }

        } catch (err) {
            console.log(err);
            return false;
        }
    }

}