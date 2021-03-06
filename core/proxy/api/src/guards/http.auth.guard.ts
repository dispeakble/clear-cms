import {CanActivate, ExecutionContext, HttpStatus, Injectable} from '@nestjs/common';


@Injectable()
export class HttpAuthGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean {
        try {
            const redirectUrl = '/view-auth'; //TODO GET THIS REDIRECT FROM SOMEWHERE ELSE
            const req = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();

            if(req.url === redirectUrl){
                if (req.session && req.session.user) {
                    response.redirect('/');//The user is logged in
                } else {
                    return true;
                }
            } else if (req.url === '/'){
                if (req.session && req.session.user) {
                    return true;
                } else {
                    response.redirect(redirectUrl);
                }
            } else {
                return true;//for the rest of the resources
            }

        } catch (err) {
            console.log(err);
            return false;
        }
    }

}