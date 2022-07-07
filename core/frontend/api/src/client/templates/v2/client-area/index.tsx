import * as React from 'react';
import {useAuthentication} from "../../../context/AuthContext";
import {
    ClientAreaWrapper, ClientGreetings,
    ClientOuter,
    ClientProfileMainInfos,
    ClientProfileMainInfosContainer,
    ClientProfilePicture, NoOfDays, Text
} from "./styled";
import Layout from "../components/Layout";
import {useTranslations} from "next-intl";
import Image from "next/image";
import ProfileDefault from "../assets/img/accounts/profile-default.png"
import moment from "moment";

const ClientAreaPage = ({ websiteName, colorScheme }: any) => {

    const {user, isAuthenticated, isLoading} = useAuthentication()
    const breadcrumbs = {
        clientArea: "Client Area"
    }

    const t = useTranslations()
    const daysDiff = (date: any) => {
        const _date= new Date(date)
        const given = moment(`${_date.getFullYear()}-${_date.getMonth() + 1}-${_date.getDate()}`, 'YYYY-MM-DD');
        return moment().diff(given, 'days');
    }

    return(
        isLoading ? (
                <>
                    <h3>{t('global.loading')}</h3>
                </>
        ) :
        ((isAuthenticated && user) ?
            (<Layout websiteName={websiteName} colorScheme={colorScheme} breadcrumb={breadcrumbs} isLogin isOrange>
                <ClientAreaWrapper>
                    <ClientOuter>
                        <ClientProfilePicture>
                            <Image src={ProfileDefault} alt="profile-picture" width={144} height={144} />
                        </ClientProfilePicture>

                        <ClientProfileMainInfos>
                            <ClientProfileMainInfosContainer>
                                <ClientGreetings>
                                    {`Hello, ${user.firstName}!`}
                                </ClientGreetings>
                                <Text>
                                    You are part of Mario Viajes for
                                </Text>
                                <NoOfDays>
                                    {daysDiff(user.createdAt as Date)} days
                                </NoOfDays>
                            </ClientProfileMainInfosContainer>
                        </ClientProfileMainInfos>
                    </ClientOuter>
                </ClientAreaWrapper>
            </Layout>
            ) : (<>
                <h3>{t('global.redirecting')}</h3>
            </>))
    )
}

export default ClientAreaPage