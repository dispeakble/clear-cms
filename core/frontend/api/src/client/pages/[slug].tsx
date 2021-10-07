import React from 'react';
import { NextPage } from 'next';
import ViewPagesPreview from "../src/templates/ViewPages/ViewPagesPreview";

import { withRouter } from 'next/router';
import getConfig from "next/config";
import axios from "axios";


const PageComponent: NextPage = (props) => {
  return(
      <ViewPagesPreview {...props} />
  )
};



export async function getServerSideProps(context: any) {

    let result: any = null;

    try {

        //TODO based on the config from the DB
        //get the url for product details
        //get the url for categories list
        //get the url for product list
        //get the url for product search (can be the same as above but with filters)
        //get the url for checkout


        const obs = await context.req.apiHub({
            protocolMethod: 'sendMessage',
            channel: 'frontendapi',
            api: 'pages',
            act: 'get',
            payload: {
                body: {
                    where: {
                        publish: 1,
                        pageLink: context.req.params[0]
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

/*export async function getStaticPaths() {
  const paths: any = [];

  return { paths, fallback: true }
}

export async function getStaticProps({ params }: {params: any}) {

    const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();


    if (MYURL.includes('/product')) {
        //get the template and inject the data
    } else {
        //display it
    }

    let pageLink = params.slug;
    if(params.slug && params.slug !== '/') {
        const parts = params.slug.split('/');
        pageLink = parts[parts.length - 1];
    }

    let condition: any = {
        pageLink: pageLink,
        istemplate: 0,
        publish: 1
    }

    const payload = {
        api: 'pages',
        act: 'get',
        where: condition
    };

    if(!pageLink.length) {
        condition = {
            is_default: 1,
            istemplate: 0,
            publish: 1
        }
    }


    payload.where = condition;

        let revalidate = 10;

    const result = await axios.post(`${serverRuntimeConfig.serverUrl}/api`, payload);

    if(result['data'].revalidate) {
        revalidate = result['data'].revalidate
    }

    return {
        props: {
            pageData: result['data']
        },
        revalidate: revalidate
    }

}*/

export default withRouter(PageComponent);