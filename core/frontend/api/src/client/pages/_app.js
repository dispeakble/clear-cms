import "../src/assets/scss/clear-crm.scss"
import { HelmetProvider } from 'react-helmet-async';

function MyApp({Component, pageProps}){
    return <HelmetProvider><Component {...pageProps} /></HelmetProvider>
}
/**
MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext);
    return {...appProps}
}
*/
export default MyApp;