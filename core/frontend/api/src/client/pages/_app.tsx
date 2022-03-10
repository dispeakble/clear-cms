import "../src/assets/scss/clear-crm.scss"
import { HelmetProvider } from 'react-helmet-async';
import * as React from "react";
import {NextIntlProvider} from "next-intl";

const MyApp = ({Component, pageProps}:{Component: React.ComponentType, pageProps: any}) => {
    return <HelmetProvider>
        <NextIntlProvider messages={pageProps.messages}>
            <Component {...pageProps} />
        </NextIntlProvider>
    </HelmetProvider>
}

export default MyApp;