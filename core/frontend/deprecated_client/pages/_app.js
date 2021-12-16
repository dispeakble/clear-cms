import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from '@material-ui/core/styles';
import styles from "../src/assets/jss/clear-crm/global.js";
import "../src/assets/scss/clear-crm.scss";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "react-redux";
import { useStore } from "../redux/store";

function MyApp({ Component, pageProps }) {

  const store = useStore(pageProps.initialReduxState);

  const [defaultPalette] = useState({});

  const createAppTheme = () => {
    return createTheme({//TODO GET USING API
      palette: defaultPalette,
      overrides: {

      },
    });
  };

  const testProp = {
      ws: false
  }

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
      <ThemeProvider theme={createAppTheme()}>
        <CssBaseline />
          <Provider store={store}>
              <Component {...pageProps} {...testProp}/>
          </Provider>
      </ThemeProvider>
    </>
  )
}


export default withStyles(styles)(MyApp);