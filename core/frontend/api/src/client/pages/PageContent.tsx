import React from 'react';
import Head from 'next/head'
import ViewPage from "../src/templates/ViewPages/ViewPage";

class PageContent{

    static async getServerSideProps(context: any) {
        let page: any = null;

        const pagePayload = context.isHome ? {
            active: 1,
            isHome: 1,
            isTemplate: 0
        } : {
            active: 1,
            isTemplate: 0,
            link: {'like': `%${context.req.params[0]}`}
        }

        try {
            const pageObs = await context.req.apiHub({
                protocolMethod: 'sendMessage',
                channel: 'frontendapi',
                api: 'pages',
                act: 'get',
                payload: {
                    body: {
                        where: pagePayload
                    }
                }
            });
            page = await pageObs.toPromise();

        } catch (err) {
            return {
                notFound: true,
            };
        }
        return {
            props: {
                pageData: page.data,
                isHome: context.isHome || false,
            },
        }
    }

    static renderContent(props: any) {

        let { seoTitle, description, websiteInfo } = props.pageData.pageConfig ||
            { seoTitle: props.pageData.title, description: ""}

        const { websiteName } = props.pageData.settings;

        if(!seoTitle || !seoTitle.length) {
            seoTitle = props.pageData.title;
        }

        if(props.pageData.pageConfig.useWebsiteTitle) {
            seoTitle = `${websiteName} :: ${seoTitle}`;
        }

        return(
            <>
                <Head>
                    <title>{`${seoTitle}`}</title>
                    <meta name="description" content={`${description}`} />
                    <meta property="og:title" content={`${seoTitle}`} />
                    <meta property="og:description" content={`${description}`} />
                    <meta property="og:url" content={`${typeof window!=='undefined' ? window.location.href : ""}`} />
                    <meta property="og:type" content="website" />
                    <meta property="og:image" content={`${websiteInfo?.defaultFavicon}`} />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="icon" type="image/*" href={`${websiteInfo?.defaultFavicon}`} />
                    {
                        !props.isHome &&
                        <link rel="canonical" href={`${typeof window!=='undefined' ? window.location.href : ""}`} />
                    }
                    <meta charSet="UTF-8" />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons"
                    />
                </Head>
                <ViewPage {...props} isDev={process.env.NODE_ENV === 'development'} />
            </>
        )
    }

}

export default PageContent;
