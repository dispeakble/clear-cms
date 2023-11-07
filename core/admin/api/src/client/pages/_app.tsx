import { HelmetProvider } from 'react-helmet-async';
import * as React from 'react';
import { NextIntlProvider } from 'next-intl';
import { AppContextProvider } from '../context/AppContext';
import { WsContextProvider } from '../context/SocketContext';
import { AuthProvider } from '../context/AuthContext';

const MyApp = ({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: any;
}) => {
  return (
    <HelmetProvider>
      <WsContextProvider settings={pageProps.settings}>
        <AppContextProvider settings={pageProps.settings}>
          <AuthProvider user={null}>
            <NextIntlProvider messages={pageProps.messages}>
              <Component {...pageProps} />
            </NextIntlProvider>
          </AuthProvider>
        </AppContextProvider>
      </WsContextProvider>
    </HelmetProvider>
  );
};

export default MyApp;
