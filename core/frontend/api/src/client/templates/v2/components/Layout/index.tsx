import * as React from "react";
import { ThemeProvider } from "styled-components";
import Header from "../Header";
import {
    GlobalStyle,
    MainWrapper, StyledMiddleText, StyledWebsiteName, StyledWebsiteSlogan,
    TopContentWrapper, Wrapper
} from "../../styled";
import Breadcrumbs from "../Breadcrumbs";
import { getIcon } from "../../helpers/icons";
import Footer from "../Footer";
import {MuiThemeProvider} from "@material-ui/core";
import {createTheme} from "@material-ui/core/styles";
import HomeSearch from "../HomeSearch";

const Layout = ({ websiteName,
                    colorScheme,
                    children,
                    breadcrumbs,
                    isLogin,
                    isOrange,
                    isInvisible,
                    isHomePage,
                    websiteSlogan }: any) => {

    const getIcons = (iconName: string) => {
        return getIcon(iconName);
    };

    console.log('theme', colorScheme)

    const theme: any = { colors: colorScheme, icon: getIcons };
    const muiTheme: any = createTheme({
        palette: colorScheme,
        overrides: {
            MuiTable: {
                root: {
                    background: "transparent",
                    borderSpacing: "0 20px",
                    borderCollapse: "revert",
                },
            },
            MuiTableHead:{
                root:{
                    background: colorScheme.white
                }
            },
            MuiTableRow: {
                head:{
                    background: "transparent",
                    "& > th:first-child": {
                        borderRadius: "10px 0 0 10px",
                    },
                    "& > th:last-child": {
                        borderRadius: "0 10px 10px 0"
                    },
                    '& > th > span > div': {
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: colorScheme.jetBlack
                    }
                },
                root: {
                    padding: "10px",
                    background: colorScheme.white,
                    "& > td:first-child": {
                        borderRadius: "10px 0 0 10px",
                        width: "150px !important",
                        borderRight: `1px dashed ${colorScheme.greyBorder}`
                    },
                    "& > td:last-child": {
                        borderRadius: "0 10px 10px 0"
                    },
                },
                footer: {
                    background: "transparent",
                    "& > tr": {
                        border:"none"
                    },
                    "& > td:first-child": {
                        width: "auto !important",
                    },
                }
            },
            MuiTableFooter:{
                root:{
                    background: "none"
                }
            },
        }
    })

    return (
        <MuiThemeProvider theme={muiTheme} >
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                {
                    !isInvisible ?
                        (
                            <MainWrapper data-testid="hotel-page-wrapper" isOrange={isOrange}>
                                <TopContentWrapper>
                                    <Header websiteName={websiteName} />
                                    {
                                        isHomePage &&
                                        (
                                            <>
                                                <HomeSearch selectedTab="packages"/>
                                                <StyledMiddleText>
                                                    <StyledWebsiteName>{websiteName}</StyledWebsiteName>
                                                    <StyledWebsiteSlogan>{websiteSlogan}</StyledWebsiteSlogan>
                                                </StyledMiddleText>
                                            </>
                                        )
                                    }
                                </TopContentWrapper>
                                {
                                    breadcrumbs &&
                                    <Wrapper isBreadcrumb>
                                        <Breadcrumbs {...breadcrumbs} />
                                    </Wrapper>
                                }
                                <Wrapper isLogin={isLogin}>
                                    {children}
                                </Wrapper>
                                <Footer />
                            </MainWrapper>
                        ) :
                        (
                            <></>
                        )
                }
            </ThemeProvider>
        </MuiThemeProvider>
    );
};

export default Layout;