import "../src/assets/scss/clear-crm.scss"
import { HelmetProvider } from 'react-helmet-async';
import * as React from "react";

const MyApp = ({Component, pageProps}:{Component: React.ComponentType, pageProps: any}) => {
    return <HelmetProvider><Component {...pageProps} /></HelmetProvider>
}

export default MyApp;