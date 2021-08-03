interface CookieInterface{
    originalMaxAge: number;
    expires: string;
    httpOnly: boolean;
    path: string;
}

export interface SessionDataInterface {
    cookie: CookieInterface;
    user?: any;
}