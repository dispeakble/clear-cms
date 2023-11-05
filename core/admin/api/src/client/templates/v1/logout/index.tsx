import * as React from 'react';
import { useAuthentication } from '../../../context/AuthContext';
import { useRouter } from 'next/router';
import { LogoutWrapper } from './styled';
import Layout from '../components/Layout';
import UseAuth from '../../../auth/auth';
import { useTranslations } from 'next-intl';

const LogoutPage = ({ websiteName, websiteSlogan, colorScheme }: any) => {
  const router = useRouter();
  const {
    setUser,
    setIsAuthenticated,
    setIsLoading,
    isLoading,
    isAuthenticated,
  } = useAuthentication();

  React.useEffect(() => {
    const checkLogout = async () => {
      let response: any = null;

      try {
        const tokens =
          JSON.parse(localStorage.getItem('tokens') as string) || null;

        if (tokens && tokens.access_token && tokens.refresh_token) {
          response = await UseAuth.useLogout(
            tokens.access_token,
            tokens.refresh_token,
          );

          if (response && response.status) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            localStorage.removeItem('tokens');
          }
        } else {
          router.push('/').then(() => {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
          });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };

    checkLogout();
  }, []);

  const breadcrumbs = {
    clientArea: 'Client Area',
  };

  const t = useTranslations();

  return isLoading ? (
    <>
      <h3>{t('global.loading')}</h3>
    </>
  ) : isAuthenticated ? (
    <Layout
      websiteName={websiteName}
      websiteSlogan={websiteSlogan}
      colorScheme={colorScheme}
      breadcrumbs={breadcrumbs}
      isLogin
    >
      <LogoutWrapper>{t('global.loggingOut')}</LogoutWrapper>
    </Layout>
  ) : (
    <>
      <h3>{t('global.redirecting')}</h3>
    </>
  );
};

export default LogoutPage;
