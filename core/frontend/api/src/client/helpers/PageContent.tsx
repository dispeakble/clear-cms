import Head from 'next/head';
import PageController from '../src/templates/Controllers/Page.controller';
import DataController from './Controllers/Data.controller';

class PageContent {

    static async getServerSideProps(context: any) {
        try {
            let dependencies: any = null;

            const pagePayload = context.isHome ? {
                active: 1,
                isHome: 1,
                isTemplate: 0
            } : {
                active: 1,
                isTemplate: 0,
                link: {'like': `%${context.req.params[0]}`}
            };

            const page = await context.req.apiHub({
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

            const dataController = new DataController(context);

            dependencies = await dataController.GetDependencies({...page.data});

            return {
                props: {
                    dependencies: dependencies,
                    pageData: page?.data,
                    isHome: context.isHome || false,
                },
            }

        } catch (err) {
            return {
                notFound: true,
            };
        }

    }

    static renderContent(props: any) {

        let seoTitle = props.pageData.pageConfig.seoTitle ||
            { seoTitle: props.pageData.title, description: ""}

        const {description, websiteInfo} = props.pageData.pageConfig || {description: ""}

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
                {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <PageController {...props} />
                }
            </>
        )
    }

}

export default PageContent;
