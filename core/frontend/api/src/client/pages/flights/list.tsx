import React from "react";
import { NextPage } from "next";

import { withRouter } from "next/router";
import dynamic from "next/dynamic";
import { NextRouter } from "next/dist/shared/lib/router/router";
import { Helmet } from "react-helmet-async";
import { useTranslations } from "next-intl";

interface WithRouterProps {
    router: NextRouter;
}

interface ComponentProps extends WithRouterProps {
    version: string;
    settings: Record<string, string>;
}

const templates: any = {
    v1: dynamic(() => import("../../templates/v1/flight/list")),
    v2: dynamic(() => import("../../templates/v2/flight/list"))
};

const PageComponent: NextPage<ComponentProps> = ({ version, settings }) => {
    const t = useTranslations();

    const Component = templates[version];

    return <>
        <Helmet>
            <title>{t("hotels.seo.pageTitle", { websiteName: settings.websiteName })}</title>

        </Helmet>
        <Component {...settings} />
    </>;
};

export async function getServerSideProps(context: any) {

    const payload = {
        channel: `db`,
        protocolMethod: "sendMessage",
        api: "sql",
        act: "get",
        payload: {
            db: "main",
            data: {
                what: "setting",
                limit: [0, 1]
            }
        }
    };

    if (!context.req.apiHub) {
        return {
            props: null
        };
    }

    const response = await context.req.apiHub(payload);

    const websiteData: any = {};

    try {
        const dbWebsiteData = JSON.parse(response.data);
        websiteData["applicationVersion"] = dbWebsiteData["applicationVersion"];
        Object.keys(dbWebsiteData["colorScheme"]).map(color => {
            if ("string" === typeof dbWebsiteData["colorScheme"][color].value) {
                dbWebsiteData["colorScheme"][color] = dbWebsiteData["colorScheme"][color].value;
            } else {
                const { r, g, b } = dbWebsiteData["colorScheme"][color].value;
                dbWebsiteData["colorScheme"][color] = `${r}, ${g}, ${b}`;
            }

        });
        websiteData["colorScheme"] = dbWebsiteData["colorScheme"];
        websiteData["selectedTheme"] = dbWebsiteData["selectedTheme"];
        websiteData["websiteAdminEmail"] = dbWebsiteData["websiteAdminEmail"];
        websiteData["websiteDomain"] = dbWebsiteData["websiteDomain"];
        websiteData["websiteName"] = dbWebsiteData["websiteName"];
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }

    return {
        props: {
            settings: websiteData,
            version: String(websiteData['selectedTheme']),
            messages: require(`../../languages/agency/${context.locale}.json`)
        }
    };
}


export default withRouter(PageComponent);