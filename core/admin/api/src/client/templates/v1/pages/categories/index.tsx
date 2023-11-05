import * as React from 'react';
import { useTranslations } from 'next-intl';
import Layout from '../../components/Layout';

const LoginPage = ({ websiteName, websiteSlogan, colorScheme }: any) => {
  const t = useTranslations();

  const breadcrumbs = {
    login: 'Categories',
  };

  return (
    <Layout
      websiteName={websiteName}
      websiteSlogan={websiteSlogan}
      colorScheme={colorScheme}
      breadcrumbs={breadcrumbs}
    >
      Categories
    </Layout>
  );
};

export default LoginPage;
