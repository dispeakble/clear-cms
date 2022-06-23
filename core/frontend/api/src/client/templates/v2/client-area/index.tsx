import * as React from 'react';
import {useAuthentication} from "../context/auth.context";
import {useRouter} from "next/router";
import {ClientAreaWrapper} from "./styled";
import Layout from "../components/Layout";

const ClientAreaPage = ({ websiteName, colorScheme }: any) => {

    const {user} = useAuthentication();
    const router = useRouter();

    React.useEffect(() => {
        if((user || user.token != "") && user.token){
            router.push('/login')
        }
    }, [])

    const breadcrumbs = {
        clientArea: "Client Area"
    }

    return(
        <Layout websiteName={websiteName} colorScheme={colorScheme} breadcrumb={breadcrumbs} isLogin isOrange>
            <ClientAreaWrapper>
                client area
            </ClientAreaWrapper>
        </Layout>
    )
}

export default ClientAreaPage