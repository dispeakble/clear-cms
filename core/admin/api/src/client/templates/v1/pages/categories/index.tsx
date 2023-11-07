import * as React from 'react';
import { useTranslations } from 'next-intl';
import Layout from '../../components/Layout';
import { Table } from '@mui/material';

const LoginPage = ({ websiteName, websiteSlogan, colorScheme }: any) => {
  const t = useTranslations();

  const breadcrumbs = {
    categories: 'Categories',
  };

  return (
    <Layout
      websiteName={websiteName}
      websiteSlogan={websiteSlogan}
      colorScheme={colorScheme}
      breadcrumbs={breadcrumbs}
    >
      <Table />
    </Layout>
  );
};

export default LoginPage;
