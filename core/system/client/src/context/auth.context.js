import React, {useState, useEffect, createContext, useContext} from "react";
import jwtDecode from "jwt-decode";
import UseAuth from "../auth/auth"
import { useHistory, useLocation } from 'react-router-dom';


const AuthContext = createContext({
    setIsLoading: () => {},
    setIsAuthenticated: () => {},
    isLoading: true,
    isAuthenticated: false,
    user: null,
    setUser: () => {}
});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ data , children }) => {
    const [user, setUser] = useState(data);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const {pathname} = useLocation()
    const history = useHistory()

    useEffect(() => {
        const checkAuth = async () => {
            try{
                const getTokens = localStorage.getItem('tokens')
                const tokens = JSON.parse(getTokens)

                const isExpired = (token) => {
                    const decodedToken = jwtDecode(token)
                    const currentDate = new Date()

                    return decodedToken?.exp * 1000 < currentDate.getTime();
                }

                let response;

                if(tokens){
                    if(isExpired(tokens['access_token'])){
                        response = await UseAuth.useRefreshToken(tokens['refresh_token'])
                    } else{
                        response = await UseAuth.useFetchProfile(tokens['access_token'])
                    }

                    if(response && response?.status === 200){
                        setUser(response.data)
                        setIsAuthenticated(true)
                        setIsLoading(false)
                        if(['/view-auth'].includes(pathname)){
                            setIsLoading(true)
                            history.push('/')
                            setIsLoading(false)
                        }
                    } else{
                        setUser(null)
                        setIsAuthenticated(false)
                        setIsLoading(false)
                        localStorage.removeItem('tokens')
                        if(!['/view-auth', '/recover-password'].includes(pathname)){
                            setIsLoading(true)
                            history.push('/view-auth')
                            setIsLoading(false)
                        }
                    }
                } else {
                    setUser(null)
                    setIsAuthenticated(false)
                    setIsLoading(false)
                    await UseAuth.useRefreshToken("refresh_token")

                    if(!['/view-auth', '/recover-password'].includes(pathname)){
                        setIsLoading(true)
                        await UseAuth.useRefreshToken("refresh_token")
                        history.push('/view-auth')
                        setIsLoading(false)
                    }
                }
            } catch(err){
                // eslint-disable-next-line no-console
                console.error(err)
            }
        }

        checkAuth()
    }, [isAuthenticated, isLoading])

    return (
        <AuthContext.Provider value={{ setIsAuthenticated, setIsLoading, isAuthenticated, isLoading, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthentication = () => useContext(AuthContext);