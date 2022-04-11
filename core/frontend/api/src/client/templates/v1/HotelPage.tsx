import * as React from "react";
import { useTranslations } from "next-intl";
import Header from "./components/Header";

import { GlobalStyle, MainWrapper, StyledContentWrapper } from "./styled";
import Breadcrumbs from "./components/Breadcrumbs";

export type HomePageProps = {
  websiteName: string;
  websiteUrl: string;
  websiteSlogan: string;
}

const HomePage = ({ websiteName, websiteUrl, websiteSlogan }: HomePageProps) => {
  const t = useTranslations();
  return <MainWrapper>
    <GlobalStyle />
    <Header websiteName={websiteName} />
    <StyledContentWrapper>
      <Breadcrumbs />
    </StyledContentWrapper>
  </MainWrapper>;
};

export default HomePage;