import * as React from 'react';
import {useAuthentication} from "../../../context/AuthContext";
import {useRouter} from "next/router";
import {LogoutWrapper} from "./styled";
import Layout from "../components/Layout";
import UseAuth from "../../../auth/auth";

const LogoutPage = ({ websiteName, colorScheme }: any) => {

    const router = useRouter();
    const {setUser, setIsAuthenticated, setIsLoading, isLoading, isAuthenticated} = useAuthentication()

    React.useEffect( () => {
        let response: any = null;

        const tokens = JSON.parse(localStorage.getItem('tokens') as string) || null;

        if(tokens && tokens.access_token && tokens.refresh_token ){
            response = UseAuth.useLogout(tokens.access_token, tokens.refresh_token)
                .then((response: any) => response)
                // eslint-disable-next-line no-console
                .catch((err: any) => console.error(err));

            if(response){
                response
                    .then((res: any) => {
                        if(res.status !== null){
                            router.push('/')
                                .then(() => {
                                    setUser(null);
                                    setIsAuthenticated(false)
                                    setIsLoading(false)
                                    localStorage.removeItem('tokens')
                                })
                        }
                    })

            }
        } else{
            router.push('/')
                .then(() => {
                    setUser(null);
                    setIsAuthenticated(false)
                    setIsLoading(false)
                })
        }

    }, [])

    const breadcrumbs = {
        clientArea: "Client Area"
    }

    return(
        isLoading ? (
                <>
                    <h3>Loading...</h3>
                </>
            ) :
            (isAuthenticated ?
                (<Layout websiteName={websiteName} colorScheme={colorScheme} breadcrumb={breadcrumbs} isLogin isOrange>
                        <LogoutWrapper>
                            login out
                        </LogoutWrapper>
                    </Layout>
                ) : (<>
                    <h3>Redirecting...</h3>
                </>))
    )
}

export default LogoutPage