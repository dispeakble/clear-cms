import * as React from "react";
import { ThemeProvider } from "styled-components";
import {ContentWrapper, GlobalStyle, MainWrapper} from "../styled";
import {getIcon} from "../helpers/icons";
import Header from "../components/Header";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import Image from "next/image"
import Img404 from "../assets/img/image404.jpg"
import Link from "next/link";
import {
    ContentContainer,
    StyledContainer,
    StyledErrorImageContainer,
    StyledHeader, StyledHomeLink,
    StyledInfoText, StyledLink, StyledLinkItem, StyledLinksList,
    TopContentWrapper
} from "./styled";
import {useTranslations} from "next-intl";

const Custom404 = ({ websiteName, websiteSlogan, colorScheme }: any) => {

    const getIcons = (iconName: string) => {
        return getIcon(iconName);
    };

    const myTheme: any = { colors: colorScheme, icon: getIcons };

    const t = useTranslations();

    const links = [
        {
            label: t('links.home'),
            link: "/"
        },
        {
            label: t('links.contact'),
            link: "/contact"
        },
        {
            label: t('links.hotels'),
            link: "/hotels"
        },
        {
            label: t('links.flights'),
            link: "/flights"
        },
        {
            label: t('links.packages'),
            link: "/packages"
        },
        {
            label: t('links.latestSearches'),
            link: "/"
        },
        {
            label: t('links.lastMinute'),
            link: "/"
        },

    ]

    return(
        <ThemeProvider theme={myTheme}>
            <Helmet>
                <title>{websiteName} :: 404 not found</title>
            </Helmet>
            <GlobalStyle />
            <MainWrapper data-testid="custom404-page-wrapper">
                <TopContentWrapper>
                    <ContentWrapper>
                        <Header websiteName={websiteName} />
                    </ContentWrapper>

                </TopContentWrapper>

                    <StyledContainer>
                        <StyledErrorImageContainer>
                            <Image src={Img404} alt="image-404"/>
                        </StyledErrorImageContainer>
                        <ContentContainer>
                            <StyledHeader>
                                {t('custom404.header')}
                            </StyledHeader>
                            <StyledInfoText>
                                {t('custom404.links')}
                            </StyledInfoText>
                            <StyledLinksList>
                                {
                                    (links && links.length) &&
                                    links.map((link : {label: string, link: string}) =>
                                        <StyledLinkItem key={link.label}>
                                            <StyledLink href={link.link}>
                                                {link.label}
                                            </StyledLink>
                                        </StyledLinkItem>
                                    )
                                }
                            </StyledLinksList>
                            <StyledInfoText center>
                                {t('custom404.return')}
                            </StyledInfoText>
                            <Link href="/">
                                <StyledHomeLink href="/">{t('custom404.goBackHome')}</StyledHomeLink>
                            </Link>
                        </ContentContainer>
                    </StyledContainer>
                <Footer />
            </MainWrapper>
        </ThemeProvider>
    )

}

export default Custom404