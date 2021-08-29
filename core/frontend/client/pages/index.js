import getConfig from 'next/config'
import axios from "axios";
import ViewPagesPreview from "../src/templates/ViewPages/ViewPagesPreview";
import React from "react";
const { serverRuntimeConfig } = getConfig();

export async function getServerSideProps({ params }) {
    const payload = {
        api: 'pages',
        act: 'get',
        where: {
            is_default: 1,
            istemplate: 0,
            publish: 1
        }
    };

    const response = await axios.post(`${serverRuntimeConfig.serverUrl}/api`, payload)
    const pageData = await response.data.data;
    return {
        props: {
            pageData,
        }
    }
}

export default function Home({ pageData }) {
    return (
        <ViewPagesPreview pageData={pageData}/>
    );
}