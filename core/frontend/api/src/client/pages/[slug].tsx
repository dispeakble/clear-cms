import React from 'react';
import { NextPage } from 'next';
import ViewPagesPreview from "../src/templates/ViewPages/ViewPagesPreview";

import { withRouter } from 'next/router';


const PageComponent: NextPage = (props) => {
  return(
      <ViewPagesPreview {...props} />
  )
};

/*export async function getStaticPaths() {
  const paths = [];

  return { paths, fallback: 'blocking' }
}*/

export async function getServerSideProps(context) {

    let result = {};

    try {
        const obs = await context.req.apiHub({
            protocolMethod: 'sendMessage',
            channel: 'frontendapi',
            api: 'pages',
            act: 'get',
            payload: {
                body: {
                    where: {
                        pageLink: context.req.params[0] || 'home'
                    }
                }
            }
        });
        const res = obs.toPromise();
        result = await res;
        console.log(result['data']);
    } catch (err) {
        console.log(err);
        return {
            notFound: true,
        };
    }

    return {
        props: {
            pageData: result['data']
        }, // will be passed to the page component as props
    }
}

/*export async function getStaticProps({ params }) {

    debugger;


    /!*let pageLink = params.slug;
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
    }*!/

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

}*/

export default withRouter(PageComponent);