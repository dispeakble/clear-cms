import React from 'react';
import { NextPage } from 'next';
import PageContent from "./PageContent";

import { withRouter } from 'next/router';


const PageComponent: NextPage = (props ) => {
  return PageContent.renderContent(props);
};

export async function getServerSideProps(context: any) {
    return PageContent.getServerSideProps(context);
}


/*

export async function getStaticProps(context: any) {
    return PageContent.getStaticProps(context);
}

export async function getStaticPaths(context: any) {
    return PageContent.getStaticPaths(context);
}

export async function getStaticPaths() {
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