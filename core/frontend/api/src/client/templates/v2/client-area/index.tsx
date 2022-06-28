import * as React from 'react';
import {useAuthentication} from "../../../context/AuthContext";
import {useRouter} from "next/router";
import {ClientAreaWrapper} from "./styled";
import Layout from "../components/Layout";
import LoaderComponent from "../components/LoaderComponent";
import {useTranslations} from "next-intl";

const ClientAreaPage = ({ websiteName, colorScheme }: any) => {

    const {user, isAuthenticated, isLoading} = useAuthentication()
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
                <ClientAreaWrapper>
                    client area - Hello, {user && user?.firstName}!
                </ClientAreaWrapper>
            </Layout>
            ) : (<>
                <h3>Redirecting...</h3>
            </>))
    )
}

export default ClientAreaPage