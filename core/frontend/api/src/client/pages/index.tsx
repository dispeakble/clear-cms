import React from 'react';
import { NextPage } from 'next';
import PageContent from "./PageContent";

import { withRouter } from 'next/router';


const PageComponent: NextPage = (props) => {
    return PageContent.renderContent(props);
};



export async function getServerSideProps(context: any) {
    context.isHome = true;
    return PageContent.getServerSideProps(context);
}

//-----------------------------SSG---------------------------

/*export async function getStaticProps({ params }: {params: any}) {

    const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

    const payload = {
        api: 'pages',
        act: 'get',
        where: {
            active: 1,
            istemplate: 0,
            isHome: 1
        }
    };

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