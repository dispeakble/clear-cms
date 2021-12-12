import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head'
import ViewPagesPreview from "../src/templates/ViewPages/ViewPagesPreview";


class PageContent{

    static async getServerSideProps(context: any) {
        let page : any = null;
        let pages: any = null;
        let categories: any = null;


        try {

            //TODO based on the config from the DB
            //get the url for product details
            //get the url for categories list
            //get the url for product list
            //get the url for product search (can be the same as above but with filters)
            //get the url for checkout


            const pageObs = await context.req.apiHub({
                protocolMethod: 'sendMessage',
                channel: 'frontendapi',
                api: 'pages',
                act: 'get',
                payload: {
                    body: {
                        how: 'AND',
                        where: {
                            ...(!context.isIndex && { publish: 1, pageLink: context.req.params[0]}),
                            ...(context.isIndex && { publish: 1, is_default: 1})
                        }
                    }
                }
            });
            const pageRes = pageObs.toPromise();
            page = await pageRes;


            //fetch pages list
            const pagesObs = await context.req.apiHub({
                protocolMethod: 'sendMessage',
                channel: 'frontendapi',
                api: 'pages',
                act: 'list',
                payload: {
                    body: {
                        where: {
                            publish: 1,
                        }
                    }
                }
            });
            const pagesRes = pagesObs.toPromise();
            pages = await pagesRes;

            //fetch categories list
            const categoriesObs = await context.req.apiHub({
                protocolMethod: 'sendMessage',
                channel: 'frontendapi',
                api: 'categories',
                act: 'list',
            });
            const categoriesRes = categoriesObs.toPromise();
            categories = await categoriesRes;

        } catch (err) {
            console.log(err);
            return {
                notFound: true,
            };
        }
        return {
            props: {
                pageData: page.data,
                pagesData: pages.data,
                categoriesData: categories
            },
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