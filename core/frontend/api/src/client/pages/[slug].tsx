import React from 'react';
import { NextPage } from 'next';
import ViewPagesPreview from "templates/ViewPages/ViewPagesPreview";

import { withRouter } from 'next/router';


const PageComponent: NextPage = (props) => {
  return(
      <ViewPagesPreview {...props} />
  )
};

export async function getStaticPaths() {
  const paths = [];

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {

    debugger;


    /*let pageLink = params.slug;
    if(params.slug && params.slug !== '/') {
        const parts = params.slug.split('/');
        pageLink = parts[parts.length - 1];
    }
    const payload = {
        api: 'pages',
        act: 'get',
        where: {
            pageLink: pageLink,
            istemplate: 0,
            publish: 1
        }
    };

    if(!pagelink.length) {
        payload.where = {
            is_default: 1,
            istemplate: 0,
            publish: 1
        }
    }

    const response = await axios.post(`${serverRuntimeConfig.serverUrl}/api`, payload);
    //console.log(response.data);
    return {
        props: {
            pageData: response.data || {}
        },
        revalidate: 10,
        fallback: "blocking"
    }*/

  return {
    props: {
      pageData: {pageConfig: {
          pageTitle: "fdrtyujhgfdfgthj",
          pageLink: "test",
          fontSize: "11px",
          fontFamily: "Arial",
          textColor: "#000",
        }}
    },
    revalidate: 10
  }

}

export default withRouter(PageComponent);