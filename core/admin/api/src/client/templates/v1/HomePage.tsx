import * as React from 'react';

import { ContentWrapper, PaperWrapper } from './styled';
import Layout from './components/Layout';

const HomePage = ({ websiteName, websiteSlogan, colorScheme }: any) => {
  return (
    <Layout
      isHomePage={true}
      selectedTab="packages"
      websiteSlogan={websiteSlogan}
      websiteName={websiteName}
      colorScheme={colorScheme}
    >
      <PaperWrapper>
        <ContentWrapper></ContentWrapper>
      </PaperWrapper>
    </Layout>
  );
};

export default HomePage;
