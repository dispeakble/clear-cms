import React from 'react';
import {NextPage} from 'next';

import {withRouter} from 'next/router';
import dynamic from "next/dynamic";
import {NextRouter} from "next/dist/shared/lib/router/router";

interface WithRouterProps {
    router: NextRouter
}

interface ComponentProps extends WithRouterProps {
    version: string;
    settings: Record<string, string>;
}

const templates: any = {
    v1: dynamic(() => import('../../templates/v1/HotelPage')),
    v2: dynamic(() => import('../../templates/v2/HotelPage')),
}

const HotelComponent: NextPage<ComponentProps> = ({version}) => {
    const Component = templates[version];

    return <Component />;
};

export async function getServerSideProps(context: any) {

    return {
        props: {
            version: String(process.env.tpl_ver), //TODO GET FROM hubAPI
            messages: require(`../../languages/agency/${context.locale}.json`)
        }
    }
}


export default withRouter(HotelComponent);