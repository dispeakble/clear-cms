import React from 'react';
import {GetServerSidePropsContext, NextPage} from 'next';

import {withRouter} from 'next/router';
import dynamic from "next/dynamic";
import {NextRouter} from "next/dist/shared/lib/router/router";

interface WithRouterProps {
    router: NextRouter
}

interface ComponentProps extends WithRouterProps {
    version: string;
}

const templates: any = {
    v1: dynamic(() => import('../../templates/v1/HomePage')),
    v2: dynamic(() => import('../../templates/v2/HomePage')),
}

const PageComponent: NextPage<ComponentProps> = ({version}) => {
    const Component = templates[version];
    return <Component/>;
};

export function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            version: String(process.env.tpl_ver),//TODO GET FROM hubAPI
            messages: require(`../../languages/agency/${context.locale}.json`)
        }
    }
}


export default withRouter(PageComponent);