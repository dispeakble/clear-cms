import * as React from "react";
import { ThemeProvider } from "styled-components";
import {ContentWrapper, GlobalStyle, MainWrapper} from "../styled";
import {getIcon} from "../helpers/icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image"
import Img300 from "../assets/img/image300.jpg"
import Img300Right from "../assets/img/image300Right.png"
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
import {useRouter} from "next/router";

const Custom404 = ({ websiteName, colorScheme }: any) => {

    const router = useRouter()



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
            <GlobalStyle />
            <MainWrapper data-testid="custom300-page-wrapper">
                <TopContentWrapper>
                    <ContentWrapper>
                        <Header websiteName={websiteName} />
                    </ContentWrapper>

                </TopContentWrapper>

                    <StyledContainer>
                        <StyledErrorImageContainer>
                            <Image src={Img300} alt="image-300"/>
                        </StyledErrorImageContainer>
                        <ContentContainer>
                            <StyledHeader>
                                {t('custom300.header')}
                            </StyledHeader>
                            <StyledInfoText>
                                {t('custom404.links')}
                            </StyledInfoText>
                            <StyledLinksList>
                                {
                                    (links && links.length) &&
                                    links.map((link : {label: string, link: string}) =>
                                        <StyledLinkItem>
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
                        <StyledErrorImageContainer>
                            <Image src={Img300Right} alt="image-300"/>
                        </StyledErrorImageContainer>
                    </StyledContainer>
                <Footer />
            </MainWrapper>
        </ThemeProvider>
    )

}

export default Custom404