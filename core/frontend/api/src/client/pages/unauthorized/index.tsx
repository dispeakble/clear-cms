import React from "react";
import {ContentContainer, StyledContainer, StyledErrorImageContainer, StyledHeader} from "../../templates/v1/404/styled";
import Image from "next/image"
import Img404 from "./assets/img.png"
import {useTranslations} from "next-intl";
import {withRouter} from "next/router";
import {NextPage} from "next";
import {Helmet} from "react-helmet-async";
import dynamic from "next/dynamic";
import { NextRouter } from "next/dist/shared/lib/router/router";

interface WithRouterProps {
    router: NextRouter;
}

interface ComponentProps extends WithRouterProps {
    version: string;
    settings: Record<string, string>;
}

const templates: any = {
    v1: dynamic(() => import("../../templates/v1/401")),
    v2: dynamic(() => import("../../templates/v2/401"))
};

const PageComponent: NextPage<ComponentProps> = ({ version, settings }) => {

    const t = useTranslations()

    const Component = templates[version];

    return(
        <>
            <Helmet>
                <title>{t("hotels.seo.pageTitle", { websiteName: settings.websiteName })}</title>

            </Helmet>

            <Component {...settings} />
        </>
    )
}

export async function getServerSideProps(context: any) {

    const payload = {
        channel: `${process.env.app}_db`,
        protocolMethod: "sendMessage",
        api: "sql",
        act: "get",
        payload: {
            db: "main",
            channel: `${process.env.app}_frontend`,
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
            version: String(process.env.tpl_ver), //TODO GET FROM hubAPI
            messages: require(`../../languages/agency/${context.locale}.json`)
        }
    };
}

export default withRouter(PageComponent)