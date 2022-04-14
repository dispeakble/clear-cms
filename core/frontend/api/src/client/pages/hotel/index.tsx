import React from 'react';
import {NextPage} from 'next';

import {withRouter} from 'next/router';
import dynamic from "next/dynamic";
import {NextRouter} from "next/dist/shared/lib/router/router";
import { Head } from "next/document";
import { useTranslations } from "next-intl";

interface WithRouterProps {
    router: NextRouter
}

interface ComponentProps extends WithRouterProps {
    version: string;
    websiteName: string;
    description: string;
    settings: Record<string, string>;
}

const templates: any = {
    v1: dynamic(() => import('../../templates/v1/HotelPage')),
    v2: dynamic(() => import('../../templates/v2/HotelPage')),
}

const HotelComponent: NextPage<ComponentProps> = ({version, websiteName, description}) => {

    const t = useTranslations();

    const Component = templates[version];

    return <>
        <Head>
            <title>{t('hotels.seo.pageTitle', {
                websiteName: websiteName
            })}</title>
            <meta
              name={description}
              content={t('hotels.seo.description', {websiteName: websiteName})}
            />
        </Head>
        <Component />
    </>;
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

    let settings = {
        websiteName: 'Website Name'
    };

    try {
        const result: any = await context.req.apiHub(payload);
        if(result && result.length) {
            settings = JSON.parse(result.data);
        }
    } catch (err) {
        settings.websiteName = 'Internal server error';
    }

    return {
        props: {
            websiteName: String(settings.websiteName),
            version: String(process.env.tpl_ver), //TODO GET FROM hubAPI
            messages: require(`../../languages/agency/${context.locale}.json`)
        }
    }
}


export default withRouter(HotelComponent);