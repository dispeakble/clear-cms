import React from "react";
import Link from "next/link";
import {Helmet} from "react-helmet";

export default class PageComponent extends React.Component<any, any>{
  render() {

    return (
      <>
        <Helmet
          title={`Page by id`}
          meta={[{ property: 'og:title', content: 'Next index page' }]}
        />
        <div>
          <p>
            <Link href={'/'}>
              <a href={'/'}>
                Back to home
              </a>
            </Link>
          </p>
          <p>
            Path: /page/pageId
          </p>
        </div>
      </>
    );
  }
}

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          pageId: '0',
        },
      },
      {
        params: {
          pageId: '1',
        },
      },
    ],
    fallback: false,
  };
}

export async function getStaticProps(payload) {
  return {
    props: {

    }
  };
}
