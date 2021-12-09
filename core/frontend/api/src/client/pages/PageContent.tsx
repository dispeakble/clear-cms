import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head'
import ViewPagesPreview from "../src/templates/ViewPages/ViewPagesPreview";


class PageContent{

    static async getServerSideProps(context: any) {
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
                            //TODO check if isIndex === true then where: {publish: true, isDefault: true}
                            publish: 1,
                            pageLink: context.req.params[0]
                        }
                    }
                }
            });
            const res = obs.toPromise();
            result = await res;
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

    static renderContent(props: any) {
        return(
            <>
                <Head>
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons"
                    />
                </Head>
                <ViewPagesPreview {...props} />
            </>
        )
    }

}




export default PageContent;