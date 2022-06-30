import * as React from 'react';
import {useAuthentication} from "../../../context/AuthContext";
import {ClientAreaWrapper} from "./styled";
import Layout from "../components/Layout";
import {useTranslations} from "next-intl";

const ClientAreaPage = ({ websiteName, colorScheme }: any) => {

    const {user, isAuthenticated, isLoading} = useAuthentication()
    const breadcrumbs = {
        clientArea: "Client Area"
    }

    const t = useTranslations()

    return(
        isLoading ? (
                <>
                    <h3>{t('global.loading')}</h3>
                </>
        ) :
        (isAuthenticated ?
            (<Layout websiteName={websiteName} colorScheme={colorScheme} breadcrumb={breadcrumbs} isLogin isOrange>
                <ClientAreaWrapper>
                    {t('global.greetings')}, {user && user?.firstName}!
                </ClientAreaWrapper>
            </Layout>
            ) : (<>
                <h3>{t('global.redirecting')}</h3>
            </>))
    )
}

export default ClientAreaPage