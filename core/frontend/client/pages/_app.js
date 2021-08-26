import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "../src/assets/jss/clear-crm/global.js";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CssBaseline from "@material-ui/core/CssBaseline";
import WsService from "../src/services/ws.service";
import getConfig from 'next/config';
import * as shortId from "shortid";
import { Provider } from "react-redux";
import { useStore } from "../redux/store";
import AppSocketInterface from "../socketInterface/app.js";


const { publicRuntimeConfig } = getConfig();

function MyApp({ Component, pageProps }) {
  const channel = 'app';

  const store = useStore(pageProps.initialReduxState);


  const [defaultPalette] = useState({});

  const [wsInstance] = useState(null);

  const createAppTheme = () => {
    return createTheme({
      palette: defaultPalette,
      overrides: {

      },
    });
  };

  return (
    <>
      <Helmet
        htmlAttributes={{ lang: 'en' }}
        title={pageProps?.pageData?.pageConfig?.pageTitle}
        meta={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
          },
          {
            property: 'og:title',
            content: pageProps?.pageData?.pageConfig?.pageTitle
          },
        ]}
      />
      <MuiThemeProvider theme={createAppTheme()}>
        <CssBaseline />
        {publicRuntimeConfig?.wsEnabled ? (
          <Provider store={store}>
            <AppSocketInterface>
              {() => {
                return (
                  <Component {...pageProps} ws={wsInstance} />
                );
              }}

            </AppSocketInterface>
          </Provider>
        ) : (
          <Component {...pageProps} ws={wsInstance} />
        )}
      </MuiThemeProvider>
    </>
  )
}


export default withStyles(styles)(MyApp);