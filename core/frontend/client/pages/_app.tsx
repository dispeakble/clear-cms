import App, { AppContext, AppInitialProps } from 'next/app'
import {Helmet} from "react-helmet";

import '../styles/globals.css'
import AppStore from "../infrastructure/store";

class WebApp extends App {
  static async getInitialProps({Component, ctx}: AppContext): Promise<AppInitialProps> {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          title="Next.js!"
          meta={[
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1',
            },
            {
              property: 'og:title',
              content: 'Hello next.js!'
            },
          ]}
        />
        <Component {...pageProps} />
      </>
    );
  }
}

export default AppStore.withRedux(WebApp);
