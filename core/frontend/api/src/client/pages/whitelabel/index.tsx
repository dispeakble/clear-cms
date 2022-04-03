import React from 'react';
import {GetServerSidePropsContext, NextPage} from 'next';

import {withRouter} from 'next/router';
import dynamic from "next/dynamic";
import {NextRouter} from "next/dist/shared/lib/router/router";
import {HomePageProps} from "../../templates/v1/HomePage";

interface WithRouterProps {
    router: NextRouter
}

interface ComponentProps extends WithRouterProps {
    version: string;
    settings: Record<string, string>;
}

const templates: any = {
    v1: dynamic(() => import('../../templates/v1/HomePage')),
    v2: dynamic(() => import('../../templates/v2/HomePage')),
}

const PageComponent: NextPage<ComponentProps> = ({version, settings}) => {
    const Component = templates[version];

    const homePagePayload: HomePageProps = {
        websiteName: settings.websiteName,
        websiteSlogan: 'test',
        websiteUrl: settings.websiteDomain
    }

    return <Component {...homePagePayload}/>;
};

export async function getServerSideProps(context: any) {

    const payload = {
        channel: `${process.env.app}_db`,
        protocolMethod: 'sendMessage',
        api: 'sql',
        act: 'get',
        payload: {
            db: 'main',
            channel: `${process.env.app}_frontend`,
            data: {
                what: 'setting',
                limit: [0, 1]
            }
        }
    }

    if(!context.req.apiHub) {
        return {
            props: null
        };
    }

    const response = await context.req.apiHub(payload);

    let websiteData = {};

    try {
        websiteData = JSON.parse(response.data);
    } catch (err) {
        console.log(err)
    }

    return {
        props: {
            settings: websiteData,
            version: String(process.env.tpl_ver), //TODO GET FROM hubAPI
            messages: require(`../../languages/agency/${context.locale}.json`)
        }
    }
}


export default withRouter(PageComponent);