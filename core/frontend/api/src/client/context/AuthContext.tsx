import * as React from "react";
import jwtDecode from "jwt-decode";
import UseAuth from "../auth/auth"
import {useRouter} from "next/router";

export type AuthContextType = {
    setIsLoading: (v: boolean) => void,
    setIsAuthenticated: (v: boolean) => void,
    isAuthenticated: boolean,
    isLoading: boolean,
    user: any,
    setUser: (u: any) => void
}

const AuthContext = React.createContext<AuthContextType>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setIsLoading: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setIsAuthenticated: () => {},
    isLoading: true,
    isAuthenticated: false,
    user: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setUser: () => {}
});

export const AuthProvider = ({ data , children }: any) => {
    const [user, setUser] = React.useState<any>(data);
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const router = useRouter();

    React.useEffect(() => {
        const getTokens: string = localStorage.getItem('tokens') as string
        const tokens = JSON.parse(getTokens)

        const isExpired = (token: string) => {
            const decodedToken:{exp: any} = jwtDecode(token)
            const currentDate = new Date()

            return decodedToken?.exp * 1000 < currentDate.getTime();
        }

        let response: any;

        if(tokens){
            if(isExpired(tokens['access_token'])){
                response =
                    UseAuth.useRefreshToken(tokens['refresh_token'])
                        .then((response: any) => response)
                        // eslint-disable-next-line no-console
                        .catch((error: any) => console.log(error))
            } else{
                response = UseAuth
                    .useFetchProfile(tokens['access_token'])
                    .then((response: any) => response)
                    // eslint-disable-next-line no-console
                    .catch((error: any) => console.log(error))
            }

            response
                .then((response: any) => {
                    if(response && response?.status === 200){
                        setUser(response.data)
                        setIsAuthenticated(true)
                        setIsLoading(false)
                        if(['/login'].includes(router.asPath)){
                            router.push('/client-area')
                        }
                    } else{
                        setUser(null)
                        setIsAuthenticated(false)
                        setIsLoading(false)
                        localStorage.removeItem('tokens')
                        if(['/client-area'].includes(router.asPath)){
                            router.push('/login')
                        }
                    }
                })
        } else {
            setUser(null)
            setIsAuthenticated(false)
            setIsLoading(false)
            if(['/client-area'].includes(router.asPath)){
                router.push('/login')
            }
        }

    }, [isAuthenticated])

    return (
        <AuthContext.Provider value={{ setIsAuthenticated, setIsLoading, isAuthenticated, isLoading, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthentication = () => React.useContext(AuthContext);