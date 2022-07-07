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

    const personalInfo: any = user && {
        'firstName': {
            value: user.firstName,
            label: t('clientArea.firstName')
        },
        'lastName': {
            value: user.lastName,
            label: t('clientArea.lastName')
        },
        'dateOfBirth': {
            value: user.dateOfBirth || '-',
            label: t('clientArea.dateOfBirth')
        },
        'contactNumber': {
            value: user.contactNumber || '-',
            label: t('clientArea.contactNumber')
        },
        'email': {
            value: user.email,
            label: t('clientArea.email')
        },
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
                                            {t('clientArea.greetings', {name: user.firstName})}
                                        </ClientGreetings>
                                        <Text>
                                            {t('clientArea.daysCount', {website: websiteName})}
                                        </Text>
                                        <NoOfDays>
                                            {daysDiff(user.createdAt as Date)} {t('global.days')}
                                        </NoOfDays>
                                    </div>
                                </div>
                                <div>
                                    <EditProfileButton>
                                        {t('clientArea.editProfile')}
                                    </EditProfileButton>
                                </div>
                            </ClientProfileMainInfosContainer>
                            <ClientPersonalInfosContainer>
                                <PersonalInfos>
                                    {t('clientArea.personalInfo')}
                                </PersonalInfos>
                                {
                                    Object.keys(personalInfo).map((key: string, index:number) =>
                                        (<PersonalInfoItem key={index}>
                                            <ItemTitle>
                                                {personalInfo[key].label}
                                            </ItemTitle>
                                            <ItemInfo>
                                                {personalInfo[key].value}
                                            </ItemInfo>
                                        </PersonalInfoItem>))
                                }

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