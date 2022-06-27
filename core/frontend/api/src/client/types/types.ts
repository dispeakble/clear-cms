export interface ILoginCredentials{
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface IRegisterData{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}