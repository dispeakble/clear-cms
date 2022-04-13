import "../src/assets/scss/clear-crm.scss";
import { HelmetProvider } from "react-helmet-async";
import * as React from "react";
import { NextIntlProvider } from "next-intl";
import { AppContextProvider } from "../context/AppContext";

const MyApp = ({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }) => {
    return (
      <HelmetProvider>
        <AppContextProvider settings={pageProps.settings}>
          <NextIntlProvider messages={pageProps.messages}>
            <Component {...pageProps} />
          </NextIntlProvider>
        </AppContextProvider>
      </HelmetProvider>
    );
};

export default MyApp;