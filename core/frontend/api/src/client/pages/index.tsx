import React from 'react';
import { NextPage } from 'next';
import { withRouter } from 'next/router';

import ViewPagesPreview from "../src/templates/ViewPages/ViewPagesPreview";

const PageComponent: NextPage = (props) => {
  return(
      <ViewPagesPreview {...props} />
  )
};

//----------------------------SG----------------------------

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
                    how: 'AND',
                    where: {
                        is_default: 1,
                        publish: 1
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

//-----------------------------SSG---------------------------

/*export async function getStaticProps({ params }: {params: any}) {

    const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

    const payload = {
        api: 'pages',
        act: 'get',
        where: {
            is_default: 1,
            istemplate: 0,
            publish: 1
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