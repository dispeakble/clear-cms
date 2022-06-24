import * as React from 'react';
import {useAuthentication} from "../context/auth.context";
import {useRouter} from "next/router";
import {ClientAreaWrapper} from "./styled";
import Layout from "../components/Layout";
import useWsContext from "../../../context/SocketContext";

const ClientAreaPage = ({ websiteName, colorScheme }: any) => {

    const router = useRouter();
    const {ws} = useWsContext();
    const {user} = useAuthentication()

    React.useEffect( () => {
        // const _user = JSON.parse(localStorage.getItem('user') as string);
        //
        // const redirectLogin = async () => await router.push('/login')
        //
        // const fetchToken = async (userEmail: string) => {
        //     const token = await ws.sendMessage({
        //         api: "auth",
        //         act: "getToken",
        //         payload: {
        //             data: {
        //                 email: userEmail,
        //             }
        //         }
        //     });
        //
        //     return token
        // }
        //
        // if(_user && _user?.token !== "" && _user?.token){
        //     const _token = fetchToken(_user?.email)
        //
        //     if(!_token || (_token && _user?.token !== _token)){
        //         redirectLogin()
        //     }
        // } else{
        //     redirectLogin()
        // }

        console.log("user -> ", user)
    }, [])

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