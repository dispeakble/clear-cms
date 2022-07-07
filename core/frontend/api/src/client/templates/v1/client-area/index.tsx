import * as React from 'react';
import {useAuthentication} from "../../../context/AuthContext";
import {
    ClientAreaWrapper, ClientGreetings,
    ClientOuter, ClientPersonalInfosContainer,
    ClientProfileMainInfos,
    ClientProfileMainInfosContainer,
    ClientProfilePicture, EditProfileButton, ItemInfo, ItemTitle, NoOfDays, PersonalInfoItem, PersonalInfos, Text
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
                        <ClientProfileMainInfos>
                            <ClientProfileMainInfosContainer>
                                <div>
                                    <ClientProfilePicture>
                                        <Image src={ProfileDefault} alt="profile-picture" width={144} height={144} />
                                    </ClientProfilePicture>
                                    <div>
                                        <ClientGreetings>
                                            {`Hello, ${user.firstName}!`}
                                        </ClientGreetings>
                                        <Text>
                                            You are part of Mario Viajes for
                                        </Text>
                                        <NoOfDays>
                                            {daysDiff(user.createdAt as Date)} days
                                        </NoOfDays>
                                    </div>
                                </div>
                                <div>
                                    <EditProfileButton>
                                        Edit profile
                                    </EditProfileButton>
                                </div>
                            </ClientProfileMainInfosContainer>
                            <ClientPersonalInfosContainer>
                                <PersonalInfos>
                                    Personal information
                                </PersonalInfos>
                                <PersonalInfoItem>
                                    <ItemTitle>
                                        First name
                                    </ItemTitle>
                                    <ItemInfo>
                                        {user.firstName}
                                    </ItemInfo>
                                </PersonalInfoItem>
                                <PersonalInfoItem>
                                    <ItemTitle>
                                        Last name
                                    </ItemTitle>
                                    <ItemInfo>
                                        {user.lastName}
                                    </ItemInfo>
                                </PersonalInfoItem>
                                <PersonalInfoItem>
                                    <ItemTitle>
                                        Email
                                    </ItemTitle>
                                    <ItemInfo>
                                        {user.email}
                                    </ItemInfo>
                                </PersonalInfoItem>
                            </ClientPersonalInfosContainer>
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