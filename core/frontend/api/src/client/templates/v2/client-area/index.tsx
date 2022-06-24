import * as React from 'react';
import {useAuthentication} from "../../../context/AuthContext";
import {useRouter} from "next/router";
import {ClientAreaWrapper} from "./styled";
import Layout from "../components/Layout";
import useWsContext from "../../../context/SocketContext";

const ClientAreaPage = ({ websiteName, colorScheme }: any) => {

    const router = useRouter();
    const {ws} = useWsContext();
    const {user} = useAuthentication()

    React.useEffect( () => {
        const redirectLogin = async () => await router.push('/login')

        const fetchToken = async (userEmail: string) => {
            return await ws.sendMessage({
                api: "auth",
                act: "getToken",
                payload: {
                    data: {
                        email: userEmail,
                    }
                }
            });
        }


        if(user && user?.token && user?.token !== ""){
            fetchToken(user?.email)
                .then((_token: string) => {
                    if(!_token || user?.token !== _token){
                        redirectLogin()
                    }
                })
        } else{
            redirectLogin()
        }
    }, [user])

    const breadcrumbs = {
        clientArea: "Client Area"
    }

    return(
        <Layout websiteName={websiteName} colorScheme={colorScheme} breadcrumb={breadcrumbs} isLogin isOrange>
            <ClientAreaWrapper>
                client area - Hello, {user && user?.firstName}!
            </ClientAreaWrapper>
        </Layout>
    )
}

export default ClientAreaPage