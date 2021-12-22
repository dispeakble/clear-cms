import React from 'react';
import Head from 'next/head'
import ViewPagesPreview from "../src/templates/ViewPages/ViewPagesPreview";


class PageContent{

    static async getServerSideProps(context: any) {
        let page: any = null;
        let pages: any = null;
        let categories: any = null;


        const pagePayload = context.isIndex ? {
            publish: 1,
            is_default: 1
        } : {
            publish: 1,
            pageLink: context.req.params[0]
        }


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
                        how: "AND",
                        where: pagePayload
                    }
                }
            });
            page = await pageObs.toPromise();


            //fetch pages list

            if(page.data?.items?.filter((item : any) => item.module.toLowerCase().includes('pagelist' || 'search'))) {
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
                pages = await pagesObs.toPromise();
            }

            //fetch categories list

            if(page.data?.items?.filter((item : any) => item.module.toLowerCase().includes('categories' || 'search'))) {
                const categoriesObs = await context.req.apiHub({
                    protocolMethod: 'sendMessage',
                    channel: 'frontendapi',
                    api: 'categories',
                    act: 'list',
                });
                categories = await categoriesObs.toPromise();
            }

        } catch (err) {
            return {
                notFound: true,
            };
        }
        return {
            props: {
                pageData: page.data,
                pagesData: pages?.data,
                categoriesData: categories?.data,
            },
        }
    }

    static renderContent(props: any) {

        const {pageMetaTitle, pageMetaDescription, pageFavicon, useWebsiteTitle, websiteInfo} = JSON.parse(props.pageData.pageConfig.data) ||
            { pageMetaTitle: null, pageMetaDescription: null, pageFavicon: null, useWebsiteTitle: false, websiteInfo: null}

        const WebsiteTitle = JSON.parse(websiteInfo.data).websiteName + ' - ' + pageMetaTitle


        return(
            <>
                <Head>
                    <title>{`${useWebsiteTitle ? WebsiteTitle : pageMetaTitle}`}</title>
                    <meta name="description" content={`${pageMetaDescription}`} />
                    <meta property="og:title" content={`${useWebsiteTitle ? WebsiteTitle : pageMetaTitle}`} />
                    <meta property="og:description" content={`${pageMetaDescription}`} />
                    <meta property="og:url" content={`${typeof window!=='undefined' ? window.location.href : ""}`} />
                    <meta property="og:type" content="website" />
                    <meta property="og:image" content={`${pageFavicon}`} />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="icon" type="image/*" href={`${pageFavicon}`} />
                    <meta charSet="UTF-8" />
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
