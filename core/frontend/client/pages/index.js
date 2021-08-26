import getConfig from 'next/config'
import axios from "axios";
import Link from "next/link";
import { Helmet } from "react-helmet";
import PageSocketInterface from "../socketInterface/page";
import ViewPagesPreview from "../src/templates/ViewPages/ViewPagesPreview";
import React from "react";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export let getStaticProps;

if(!publicRuntimeConfig?.wsEnabled) {

    getStaticProps = async ({ params }) => {
        const payload = {
            api: 'pages',
            act: 'get',
            where: {
                is_default: 1,
                istemplate: 0,
                publish: 1
            }
        };

        const response = await axios.post(`${serverRuntimeConfig.serverUrl}/api`, JSON.stringify(payload))
        const pageData = await response.data.data;
        return {
            props: {
                pageData,
            },
            revalidate: 60,
        }
    }
}


export default function Home({ pageData }) {
    return (
        publicRuntimeConfig?.wsEnabled ?
            (
                <PageSocketInterface slug={"/"}>
                    {() => {
                        return(
                            <ViewPagesPreview pageData={pageData} />
                        )
                    }}
                </PageSocketInterface>
            ) : (
                <ViewPagesPreview pageData={pageData} pageDataLoaded={true}/>
            )

    );
}