import * as React from 'react';
import {useAuthentication} from "../../../context/AuthContext";
import {useRouter} from "next/router";
import {LogoutWrapper} from "./styled";
import Layout from "../components/Layout";
import useWsContext from "../../../context/SocketContext";

const LogoutPage = ({ websiteName, colorScheme }: any) => {

    const router = useRouter();
    const {ws} = useWsContext();
    const {user, setUser} = useAuthentication()

    React.useEffect( () => {
        const redirectHomePage = async () => await router.push('/')

        const useLogout = async (userEmail: string) => {
            return await ws.sendMessage({
                api: "auth",
                act: "logout",
                payload: {
                    data: {
                        email: userEmail,
                    }
                }
            });
        }

        if(user){
            useLogout(user.email)
                .then(() => {
                    setUser(null)
                    redirectHomePage()
                })
        } else{
            redirectHomePage()
        }

    }, [user])

    const breadcrumbs = {
        clientArea: "Client Area"
    }

    return(
        <Layout websiteName={websiteName} colorScheme={colorScheme} breadcrumb={breadcrumbs} isLogin isOrange>
            <LogoutWrapper>
                Login out...
            </LogoutWrapper>
        </Layout>
    )
}

export default LogoutPage