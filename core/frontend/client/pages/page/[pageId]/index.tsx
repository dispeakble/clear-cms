import React from "react";
import Link from "next/link";
import Router from 'next/router'
import {Helmet} from "react-helmet";

export default class PageComponent extends React.Component<any, any>{
  render() {

    return (
      <>
        <Helmet
          title={`Page ${Router.router?.query?.pageId}`}
          meta={[{ property: 'og:title', content: 'Next index page' }]}
        />
        <div>
          <p>
            <Link href={'/'}>
              Back to home
            </Link>
          </p>
          <p>
            Path: {Router.route}
          </p>
          <p>
            Page id: {Router.router?.query?.pageId}
          </p>
        </div>
      </>
    );
  }
}


